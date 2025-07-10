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
const EmailService_1 = require("./EmailService");
const ProviderA_1 = require("./providers/ProviderA");
const ProviderB_1 = require("./providers/ProviderB");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const service = new EmailService_1.EmailService([new ProviderA_1.ProviderA(), new ProviderB_1.ProviderB()]);
        const email = { id: "1", to: "test@example.com", subject: "Hello", body: "World" };
        try {
            yield service.send(email);
            console.log("Email sent successfully");
        }
        catch (err) {
            console.log("Failed to send email", err);
        }
        console.log("Status:", service.getStatus(email.id));
    });
}
main();
