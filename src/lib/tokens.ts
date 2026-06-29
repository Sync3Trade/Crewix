import { randomBytes } from "crypto";

export function generateToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function getTokenExpiry(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
