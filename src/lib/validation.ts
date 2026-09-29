export interface ConsultInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateConsult(body: Record<string, unknown>): {
  valid: boolean;
  error?: string;
  data?: ConsultInput;
} {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const company = typeof body.company === "string" ? body.company.trim() : "";

  if (!name) return { valid: false, error: "Name is required." };
  if (!email) return { valid: false, error: "Email is required." };
  if (!isValidEmail(email))
    return { valid: false, error: "Enter a valid email address." };
  if (!message) return { valid: false, error: "Message is required." };

  return {
    valid: true,
    data: {
      name,
      email,
      message,
      phone: phone || undefined,
      company: company || undefined,
    },
  };
}
