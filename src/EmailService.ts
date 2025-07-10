import { Email, EmailProvider } from "./types";

export class EmailService {
  private providers: EmailProvider[];
  private sentEmails = new Set<string>(); // idempotency
  private rateLimit = 5;
  private sentCount = 0;
  private statusMap = new Map<string, string>();
  private circuitOpen = false;

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
  }

  async send(email: Email): Promise<void> {
    if (this.sentEmails.has(email.id)) {
      console.log(`Duplicate detected for ${email.id}`);
      this.statusMap.set(email.id, "duplicate");
      return;
    }

    if (this.sentCount >= this.rateLimit) {
      throw new Error("Rate limit exceeded");
    }

    if (this.circuitOpen) {
      throw new Error("Circuit breaker open");
    }

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      try {
        await this.sendWithRetry(provider, email, 3);
        this.sentEmails.add(email.id);
        this.sentCount++;
        this.statusMap.set(email.id, "sent");
        return;
      } catch (err) {
        console.log(`Provider ${i} failed: ${err}`);
      }
    }

    this.statusMap.set(email.id, "failed");
    this.openCircuitBreaker();
    throw new Error("All providers failed");
  }

  private async sendWithRetry(provider: EmailProvider, email: Email, retries: number): Promise<void> {
    let attempt = 0;
    let delay = 100;

    while (attempt < retries) {
      try {
        await provider.send(email);
        return;
      } catch {
        attempt++;
        await this.sleep(delay);
        delay *= 2; // exponential backoff
      }
    }
    throw new Error(`Retries exhausted for ${email.id}`);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private openCircuitBreaker() {
    this.circuitOpen = true;
    setTimeout(() => {
      this.circuitOpen = false;
      console.log("Circuit closed");
    }, 5000);
  }

  getStatus(emailId: string): string | undefined {
    return this.statusMap.get(emailId);
  }
}
