import nodemailer from "nodemailer";

const isEmailEnabled =
  !!process.env.SMTP_HOST &&
  !!process.env.SMTP_PORT &&
  !!process.env.SMTP_USER &&
  !!process.env.SMTP_PASS;

let transporter: nodemailer.Transporter | null = null;

if (isEmailEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendEmail = async ({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> => {
  if (!isEmailEnabled || !transporter) {
    console.log("[EMAIL DISABLED] Skipping email to:", to);
    return;
  }

  await transporter.sendMail({
    from: `"Guptas LMS" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};
