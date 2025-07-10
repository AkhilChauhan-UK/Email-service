import { EmailService } from "../src/EmailService";
import { EmailProvider, Email } from "../src/types";

class MockProvider implements EmailProvider {
  async send(email: Email): Promise<void> {}
}

test("should send email successfully", async () => {
  const provider = new MockProvider();
  const service = new EmailService([provider]);
  const email: Email = { id: "1", to: "a@test.com", subject: "Test", body: "Body" };

  await service.send(email);
  expect(service.getStatus(email.id)).toBe("sent");
});

test("should not send duplicate email", async () => {
  const provider = new MockProvider();
  const service = new EmailService([provider]);
  const email: Email = { id: "1", to: "a@test.com", subject: "Test", body: "Body" };

  await service.send(email);
  await service.send(email); // duplicate
  expect(service.getStatus(email.id)).toBe("duplicate");
});
