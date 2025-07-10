"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
class EmailService {
    constructor(providers) {
        this.sentEmails = new Set(); // idempotency
        this.rateLimit = 5;
        this.sentCount = 0;
        this.statusMap = new Map();
        this.circuitOpen = false;
        this.providers = providers;
    }
    send(email) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    yield this.sendWithRetry(provider, email, 3);
                    this.sentEmails.add(email.id);
                    this.sentCount++;
                    this.statusMap.set(email.id, "sent");
                    return;
                }
                catch (err) {
                    console.log(`Provider ${i} failed: ${err}`);
                }
            }
            this.statusMap.set(email.id, "failed");
            this.openCircuitBreaker();
            throw new Error("All providers failed");
        });
    }
    sendWithRetry(provider, email, retries) {
        return __awaiter(this, void 0, void 0, function* () {
            let attempt = 0;
            let delay = 100;
            while (attempt < retries) {
                try {
                    yield provider.send(email);
                    return;
                }
                catch (_a) {
                    attempt++;
                    yield this.sleep(delay);
                    delay *= 2; // exponential backoff
                }
            }
            throw new Error(`Retries exhausted for ${email.id}`);
        });
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    openCircuitBreaker() {
        this.circuitOpen = true;
        setTimeout(() => {
            this.circuitOpen = false;
            console.log("Circuit closed");
        }, 5000);
    }
    getStatus(emailId) {
        return this.statusMap.get(emailId);
    }
}
exports.EmailService = EmailService;
