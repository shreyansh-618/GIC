import { sendEmail } from "./email";

export const sendAccessCodeEmail = async (email: string, code: string) => {
  await sendEmail({
    to: email,
    subject: "Your Teacher Verification Code",
    text: `Your verification code is: ${code}

This code is valid for 24 hours.

If you did not request this, please ignore this email.`,
  });
};
