export interface Email {
    id: string; // For idempotency
    to: string;
    subject: string;
    body: string;
  }
  
  export interface EmailProvider {
    send(email: Email): Promise<void>;
  }
  