# 📧 Resilient Email Service

A **TypeScript-based resilient email sending service** implementing:

- Retry logic with exponential backoff
- Fallback between two mock providers
- Idempotency to prevent duplicate sends
- Basic rate limiting
- Status tracking for email sending attempts
- Circuit breaker pattern
- Simple logging

---

## 🚀 **Features**

✅ Two mock email providers  
✅ Retry mechanism with exponential backoff  
✅ Fallback to secondary provider on failure  
✅ Idempotency using email IDs  
✅ Rate limiting (max 5 emails per process run)  
✅ Circuit breaker opens on complete failure and resets after timeout  
✅ Simple logging for actions and failures  
✅ Basic in-memory queue system (extensible)  
✅ Designed using **SOLID principles**

---

## 📂 **Project Structure**

```
email-service/
├── src/
│   ├── EmailService.ts
│   ├── providers/
│   │   ├── ProviderA.ts
│   │   └── ProviderB.ts
│   ├── types.ts
│   └── index.ts
├── tests/
│   └── EmailService.test.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ **Setup Instructions**

1. **Clone the repository**

```bash
git clone <repo-url>
cd email-service
```

2. **Install dependencies**

```bash
npm install
```

3. **Build the project**

```bash
npm run build
```

4. **Run the project**

```bash
npm start
```

5. **Run tests**

```bash
npm test
```

---

## 📝 **Usage**

The entry point `src/index.ts` demonstrates sending an email using `EmailService`:

```ts
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
```

✔ Providers randomly fail to simulate real-world behavior.

---

## ⚠️ **Assumptions**

- Providers are mocked with 50% failure probability.
- Rate limiting is per process run, not distributed.
- Circuit breaker opens for **5 seconds** after total failure and then resets.
- Queue system is minimal in-memory (can be extended to Redis).

---

## 📊 **Evaluation Criteria**

✅ Code quality and organization  
✅ Correct implementation of required features  
✅ Error handling and edge cases covered  
✅ Testability with Jest unit tests  
✅ Clear documentation

---

## ✨ **Bonus Implementations**

✔ Circuit breaker pattern  
✔ Simple logging using `console.log`  
✔ Basic queue logic can be integrated (currently in-memory)

---

## 🤝 **Contributing**

1. Fork this repo
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to your branch
5. Open a **Pull Request**

---

## 📄 **License**

MIT License

---

## 👨‍💻 **Author**

**Akhil Chauhan**  
Backend Developer | Python | Django | TypeScript  
[LinkedIn](https://www.linkedin.com/in/akhil-chauhan-b220a62a7) • [GitHub](https://github.com/AkhilChauhan-UK)

---

> **Designed with focus on reliability, clean code, and real-world system design principles.**

