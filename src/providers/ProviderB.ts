import { Email, EmailProvider } from "../types";

export class ProviderA implements EmailProvider {
  async send(email: Email): Promise<void> {
    console.log(`ProviderA sending to ${email.to}`);
    if (Math.random() < 0.5) throw new Error("ProviderA failed");
  }
}

export class ProviderB implements EmailProvider {
  async send(email: Email): Promise<void> {
    console.log(`ProviderB sending to ${email.to}`);
    if (Math.random() < 0.5) throw new Error("ProviderB failed");
  }
}
