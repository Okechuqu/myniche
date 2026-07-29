const PLACEHOLDER_EMAIL_PATTERNS = [
  "@reelsdraft.example",
  "@reelsdraft.local",
  "@example.com",
];

export function publicContactEmail(value?: string | null) {
  const email = value?.trim();

  if (
    !email ||
    PLACEHOLDER_EMAIL_PATTERNS.some((pattern) =>
      email.toLowerCase().endsWith(pattern),
    )
  ) {
    return null;
  }

  return email;
}

export function publicContactPhone(value?: string | null) {
  const phone = value?.trim();
  const digits = phone?.replace(/\D/g, "");

  if (!phone || !digits || digits === "15551234567") {
    return null;
  }

  return phone;
}
