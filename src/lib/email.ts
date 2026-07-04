import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.EMAIL_FROM ?? "VertexWork <onboarding@vertexwork.com>";
const appUrl = process.env.AUTH_URL ?? "http://localhost:3000";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (resend) {
    await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
      text,
    });
    return;
  }

  console.log("\n--- Email (dev mode) ---");
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);
  console.log("---\n");
}

function emailLayout(content: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;border:1px solid #e2e8f0;overflow:hidden;">
                <tr>
                  <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4);padding:32px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">VertexWork</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    ${content}
                  </td>
                </tr>
                <tr>
                  <td style="padding:24px 32px;border-top:1px solid #e2e8f0;text-align:center;">
                    <p style="margin:0;color:#94a3b8;font-size:12px;">
                      &copy; ${new Date().getFullYear()} VertexWork, Inc. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buttonHtml(href: string, label: string) {
  return `
    <a href="${href}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;border-radius:9999px;font-weight:600;font-size:14px;">
      ${label}
    </a>
  `;
}

export async function sendVerificationEmail(email: string, token: string) {
  const verifyUrl = `${appUrl}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your VertexWork email address",
    html: emailLayout(`
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">Verify your email</h2>
      <p style="margin:0 0 8px;color:#64748b;font-size:15px;line-height:1.6;">
        Thanks for signing up for VertexWork! Click the button below to verify your email address and activate your account.
      </p>
      ${buttonHtml(verifyUrl, "Verify Email Address")}
      <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
        This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
      </p>
    `),
    text: `Verify your VertexWork email: ${verifyUrl}`,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${appUrl}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your VertexWork password",
    html: emailLayout(`
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">Reset your password</h2>
      <p style="margin:0 0 8px;color:#64748b;font-size:15px;line-height:1.6;">
        We received a request to reset your password. Click the button below to choose a new one.
      </p>
      ${buttonHtml(resetUrl, "Reset Password")}
      <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
        This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
      </p>
    `),
    text: `Reset your VertexWork password: ${resetUrl}`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${appUrl}/onboarding`;

  await sendEmail({
    to: email,
    subject: "Welcome to VertexWork — let's set up your AI workforce",
    html: emailLayout(`
      <h2 style="margin:0 0 16px;color:#0f172a;font-size:20px;">Welcome aboard, ${name}!</h2>
      <p style="margin:0 0 8px;color:#64748b;font-size:15px;line-height:1.6;">
        Your email is verified and your account is ready. Complete your onboarding to deploy your first AI employee in minutes.
      </p>
      ${buttonHtml(dashboardUrl, "Complete Setup")}
      <p style="margin:0;color:#94a3b8;font-size:13px;line-height:1.6;">
        Need help? Reply to this email or visit our help center.
      </p>
    `),
    text: `Welcome to VertexWork! Complete setup: ${dashboardUrl}`,
  });
}
