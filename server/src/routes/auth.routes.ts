import { Hono } from "hono";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";
import {
  validateEmail,
  validatePassword,
  validateBody,
} from "../utils/validation";

const authRoutes = new Hono();

// Register
authRoutes.post("/register", async (c) => {
  try {
    const body = await c.req.json();

    const errors = validateBody(body, {
      name: { required: true, type: "string", minLength: 2 },
      email: { required: true, type: "string" },
      password: { required: true, type: "string" },
      role: { required: true, type: "string" },
    });

    if (errors.length) return c.json({ errors }, 400);
    if (!validateEmail(body.email))
      return c.json({ error: "Invalid email format" }, 400);

    const pwd = validatePassword(body.password);
    if (!pwd.valid) return c.json({ error: pwd.errors }, 400);

    const exists = await User.findOne({ email: body.email });
    if (exists) return c.json({ error: "Email already registered" }, 409);

    const user = new User({
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
      role: body.role,
      teacherId: body.role === "student" ? body.teacherId : undefined,
      status: body.role === "teacher" ? "pending" : "active",
      isVerified: body.role === "student",
    });

    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    return c.json(
      {
        message: "User registered successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          isVerified: user.isVerified,
        },
        token,
      },
      201
    );
  } catch (e) {
    console.error(e);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// Login
authRoutes.post("/login", async (c) => {
  try {
    const body = await c.req.json();

    if (!body.email || !body.password)
      return c.json({ error: "Email and password required" }, 400);

    const user = await User.findOne({ email: body.email });
    if (!user) return c.json({ error: "Invalid credentials" }, 401);

    const ok = await comparePassword(body.password, user.password);
    if (!ok) return c.json({ error: "Invalid credentials" }, 401);

    if (user.role === "teacher" && !user.isVerified) {
      return c.json({ error: "Teacher account pending verification" }, 403);
    }

    const token = generateToken(user._id.toString(), user.role);

    return c.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (e) {
    console.error(e);
    return c.json({ error: "Login failed" }, 500);
  }
});

authRoutes.post("/refresh", async (c) => {
  try {
    const { token } = await c.req.json();
    const decoded = verifyToken(token);
    return c.json({
      token: generateToken(decoded.userId, decoded.role),
    });
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default authRoutes;
