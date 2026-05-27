import nodemailer from "nodemailer";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
}

export async function sendInterviewEmail({
  to,
  candidateName,
  jobTitle,
  companyName,
  interviewDate,
  interviewTime,
  interviewType,
  meetingLink,
  message,
}) {
  const transport = createTransport();
  if (!transport) {
    console.warn("SMTP not configured — interview email skipped");
    return { sent: false, reason: "smtp_not_configured" };
  }

  const formattedDate = new Date(interviewDate).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #4f46e5;">Interview Scheduled</h2>
      <p>Hi ${candidateName},</p>
      <p>${message}</p>
      <table style="width:100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Role</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${jobTitle}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Company</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${companyName || "—"}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Date</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${formattedDate}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Time</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${interviewTime}</td></tr>
        <tr><td style="padding:8px;border-bottom:1px solid #eee;"><strong>Type</strong></td><td style="padding:8px;border-bottom:1px solid #eee;">${interviewType}</td></tr>
        ${meetingLink ? `<tr><td style="padding:8px;"><strong>Meeting link</strong></td><td style="padding:8px;"><a href="${meetingLink}">${meetingLink}</a></td></tr>` : ""}
      </table>
      <p style="color:#64748b;font-size:14px;">Please be prepared and join on time. Good luck!</p>
    </div>
  `;

  await transport.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject: `Interview scheduled — ${jobTitle}`,
    html,
    text: `${message}\n\nRole: ${jobTitle}\nDate: ${formattedDate}\nTime: ${interviewTime}\nType: ${interviewType}${meetingLink ? `\nLink: ${meetingLink}` : ""}`,
  });

  return { sent: true };
}
