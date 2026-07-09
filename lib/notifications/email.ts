import { EMAIL_FROM, getResendClient } from "@/lib/resend/client";

function emailShell(bodyHtml: string) {
  return `
    <div style="background:#08090D;padding:32px 16px;font-family:-apple-system,Helvetica,Arial,sans-serif;">
      <div style="max-width:480px;margin:0 auto;background:#111319;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
        <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);">
          <span style="color:#F5F6F8;font-size:18px;font-weight:700;">Revvy</span>
        </div>
        <div style="padding:28px;color:#D5D8DE;font-size:14px;line-height:1.6;">
          ${bodyHtml}
        </div>
        <div style="padding:20px 28px;border-top:1px solid rgba(255,255,255,0.08);color:#5C6270;font-size:12px;">
          Revvy, Inc. &middot; Mechanics that come to you.
        </div>
      </div>
    </div>
  `;
}

// Every send is best-effort: notification delivery must never block or fail
// the underlying booking/approval action it's attached to (see callers).
async function sendEmail(to: string, subject: string, html: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipped email "${subject}" to ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: EMAIL_FROM, to, subject, html });
  } catch (err) {
    console.error(`Failed to send email "${subject}" to ${to}:`, err);
  }
}

export async function sendBookingConfirmationEmail(params: {
  to: string;
  customerName: string;
  serviceNames: string[];
  total: number;
  schedulingType: "asap" | "scheduled";
  appointmentUrl: string;
}) {
  const { to, customerName, serviceNames, total, schedulingType, appointmentUrl } = params;

  await sendEmail(
    to,
    "Your Revvy booking is confirmed",
    emailShell(`
      <p style="color:#F5F6F8;font-size:18px;font-weight:600;margin:0 0 12px;">Thanks, ${customerName}!</p>
      <p style="margin:0 0 16px;">
        ${schedulingType === "asap" ? "We're finding a nearby mechanic for you now." : "Your service is scheduled — we'll dispatch a mechanic shortly before your appointment."}
      </p>
      <div style="background:#08090D;border-radius:12px;padding:16px 18px;margin:0 0 20px;">
        ${serviceNames.map((s) => `<div style="padding:4px 0;">${s}</div>`).join("")}
        <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:10px;padding-top:10px;color:#F5F6F8;font-weight:600;">
          Total: $${total.toFixed(2)}
        </div>
      </div>
      <a href="${appointmentUrl}" style="display:inline-block;background:#2E6BFF;color:#F5F6F8;text-decoration:none;padding:10px 20px;border-radius:999px;font-weight:600;">
        Track your appointment
      </a>
    `)
  );
}

export async function sendMechanicDecisionEmail(params: {
  to: string;
  mechanicName: string;
  decision: "approved" | "rejected" | "needs_more_info" | "suspended";
  reason?: string | null;
}) {
  const { to, mechanicName, decision, reason } = params;

  const copy: Record<typeof decision, { subject: string; heading: string; body: string }> = {
    approved: {
      subject: "You're approved to drive jobs on Revvy",
      heading: `Welcome aboard, ${mechanicName}!`,
      body: "Your application has been approved. Go online from your dashboard whenever you're ready to start receiving jobs.",
    },
    rejected: {
      subject: "Update on your Revvy mechanic application",
      heading: `Hi ${mechanicName},`,
      body: "After review, we're not able to approve your application at this time.",
    },
    needs_more_info: {
      subject: "We need more info on your Revvy application",
      heading: `Hi ${mechanicName},`,
      body: "We need a bit more information before we can approve your application. Please check your document uploads in your dashboard.",
    },
    suspended: {
      subject: "Your Revvy mechanic account has been suspended",
      heading: `Hi ${mechanicName},`,
      body: "Your account has been suspended. Contact support if you believe this is in error.",
    },
  };

  const { subject, heading, body } = copy[decision];

  await sendEmail(
    to,
    subject,
    emailShell(`
      <p style="color:#F5F6F8;font-size:18px;font-weight:600;margin:0 0 12px;">${heading}</p>
      <p style="margin:0 0 16px;">${body}</p>
      ${reason ? `<p style="color:#9AA1AF;font-size:13px;margin:0;">Note from our team: ${reason}</p>` : ""}
    `)
  );
}
