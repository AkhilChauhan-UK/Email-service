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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
var EmailService = /** @class */ (function () {
    function EmailService(providers) {
        this.sentEmails = new Set(); // idempotency
        this.rateLimit = 5;
        this.sentCount = 0;
        this.statusMap = new Map();
        this.circuitOpen = false;
        this.providers = providers;
    }
    EmailService.prototype.send = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var i, provider, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.sentEmails.has(email.id)) {
                            console.log("Duplicate detected for ".concat(email.id));
                            this.statusMap.set(email.id, "duplicate");
                            return [2 /*return*/];
                        }
                        if (this.sentCount >= this.rateLimit) {
                            throw new Error("Rate limit exceeded");
                        }
                        if (this.circuitOpen) {
                            throw new Error("Circuit breaker open");
                        }
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < this.providers.length)) return [3 /*break*/, 6];
                        provider = this.providers[i];
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.sendWithRetry(provider, email, 3)];
                    case 3:
                        _a.sent();
                        this.sentEmails.add(email.id);
                        this.sentCount++;
                        this.statusMap.set(email.id, "sent");
                        return [2 /*return*/];
                    case 4:
                        err_1 = _a.sent();
                        console.log("Provider ".concat(i, " failed: ").concat(err_1));
                        return [3 /*break*/, 5];
                    case 5:
                        i++;
                        return [3 /*break*/, 1];
                    case 6:
                        this.statusMap.set(email.id, "failed");
                        this.openCircuitBreaker();
                        throw new Error("All providers failed");
                }
            });
        });
    };
    EmailService.prototype.sendWithRetry = function (provider, email, retries) {
        return __awaiter(this, void 0, void 0, function () {
            var attempt, delay, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        attempt = 0;
                        delay = 100;
                        _b.label = 1;
                    case 1:
                        if (!(attempt < retries)) return [3 /*break*/, 7];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 6]);
                        return [4 /*yield*/, provider.send(email)];
                    case 3:
                        _b.sent();
                        return [2 /*return*/];
                    case 4:
                        _a = _b.sent();
                        attempt++;
                        return [4 /*yield*/, this.sleep(delay)];
                    case 5:
                        _b.sent();
                        delay *= 2; // exponential backoff
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 1];
                    case 7: throw new Error("Retries exhausted for ".concat(email.id));
                }
            });
        });
    };
    EmailService.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    EmailService.prototype.openCircuitBreaker = function () {
        var _this = this;
        this.circuitOpen = true;
        setTimeout(function () {
            _this.circuitOpen = false;
            console.log("Circuit closed");
        }, 5000);
    };
    EmailService.prototype.getStatus = function (emailId) {
        return this.statusMap.get(emailId);
    };
    return EmailService;
}());
exports.EmailService = EmailService;
