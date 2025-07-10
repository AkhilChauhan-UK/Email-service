import { EmailService } from "./EmailService";
import { ProviderA } from "./providers/ProviderA";
import { ProviderB } from "./providers/ProviderB";


async function main() {
  const service = new EmailService([new ProviderA(), new ProviderB()]);
  const email = { id: "1", to: "test@example.com", subject: "Hello", body: "World" };

  try {
    await service.send(email);
    console.log("Email sent successfully");
  } catch (err) {
    console.log("Failed to send email", err);
  }

  console.log("Status:", service.getStatus(email.id));
}

main();
