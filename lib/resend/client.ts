import { Resend } from "resend";

let client: Resend | null = null;

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export const EMAIL_FROM = "Revvy <onboarding@resend.dev>";
