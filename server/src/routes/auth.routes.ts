import { Hono } from "hono";
import { User } from "../models/User";
import { hashPassword, comparePassword } from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";
import { validateEmail, validatePassword } from "../utils/validation";

const authRoutes = new Hono();

// Register User
authRoutes.post("/register", async (c) => {
  try {
    const { name, email, password, role, teacherId } = await c.req.json();

    // Validation
    if (!name || !email || !password || !role) {
      return c.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!validateEmail(email)) {
      return c.json({ error: "Invalid email format" }, { status: 400 });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return c.json({ error: passwordValidation.errors }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return c.json({ error: "Email already registered" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      teacherId,
      status: role === "teacher" ? "pending" : "active",
      isVerified: role === "student",
    });

    await user.save();

    // Generate token
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed" }, { status: 500 });
  }
});

// Login User
authRoutes.post("/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return c.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check teacher verification status
    if (user.role === "teacher" && !user.isVerified) {
      return c.json(
        {
          error: "Teacher account pending verification",
          requiresVerification: true,
          userId: user._id,
        },
        { status: 403 }
      );
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
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, { status: 500 });
  }
});

authRoutes.post("/refresh", async (c) => {
  try {
    const { token } = await c.req.json();

    if (!token) {
      return c.json({ error: "Token required" }, { status: 400 });
    }

    const decoded = verifyToken(token);
    const newToken = generateToken(decoded.userId, decoded.role);

    return c.json({
      message: "Token refreshed",
      token: newToken,
    });
  } catch (error) {
    return c.json({ error: "Invalid token" }, { status: 401 });
  }
});

authRoutes.post("/logout", async (c) => {
  return c.json({ message: "Logged out successfully" });
});

export default authRoutes;
