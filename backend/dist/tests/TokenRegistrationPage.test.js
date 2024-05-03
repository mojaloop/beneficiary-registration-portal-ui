"use strict";
/* import { registerToken } from "../TokenService";
import { decodeJWTToken } from "../JWTService";

// Suggested test file path:

describe("TokenRegistrationPage", () => {
  describe("registerToken", () => {
    it("should register a token with valid params", async () => {
      const paymentType = "MSISDN";
      const payeeId = "1234567890";
      const sub = "abc123";

      const token = await registerToken(paymentType, payeeId, sub);

      expect(token).toBeDefined();
    });

    it("should return null with invalid payment type", async () => {
      const paymentType = "INVALID";
      const payeeId = "1234567890";
      const sub = "abc123";

      const token = await registerToken(paymentType, payeeId, sub);

      expect(token).toBeNull();
    });

    it("should return null with invalid payee ID", async () => {
      const paymentType = "MSISDN";
      const payeeId = "INVALID";
      const sub = "abc123";

      const token = await registerToken(paymentType, payeeId, sub);

      expect(token).toBeNull();
    });

    it("should return null with invalid sub", async () => {
      const paymentType = "MSISDN";
      const payeeId = "1234567890";
      const sub = "INVALID";

      const token = await registerToken(paymentType, payeeId, sub);

      expect(token).toBeNull();
    });
  });

  describe("decodeJWTToken", () => {
    it("should decode a valid JWT token", async () => {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

      const decoded = await decodeJWTToken(token);

      expect(decoded).toBeDefined();
      expect(decoded.sub).toBe("1234567890");
    });

    it("should return null for invalid token", async () => {
      const token = "invalid";

      const decoded = await decodeJWTToken(token);

      expect(decoded).toBeNull();
    });
  });
});
 */ 
