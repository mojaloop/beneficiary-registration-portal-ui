"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.decodeToken = exports.extractPrivatePublicKey = exports.decodeJWTToken = exports.decodeJoseJWTToken = exports.signJWTToken = exports.generateJoseJWTToken = exports.generateJWTToken = void 0;
const jose = __importStar(require("jose"));
const jose_1 = require("jose");
const jose_2 = require("jose");
var jwkToPem = require("jwk-to-pem");
/**
 * Generates a JWT token using the HMAC SHA-256 algorithm.
 *
 * @param {string} clientId The client ID of the application
 * @param {string} audience The audience of the JWT token
 * @param {number} [expirationInMinutes=60] The expiration time of the JWT token in minutes
 * @param {string} [issuer=clientId] The issuer of the JWT token
 * @param {string} [subject=clientId] The subject of the JWT token
 * @returns {Promise<string>} The signed JWT token
 */
const generateJWTToken = (clientId_1, audience_1, ...args_1) => __awaiter(void 0, [clientId_1, audience_1, ...args_1], void 0, function* (clientId, audience, expirationInMinutes = 60, issuer = clientId, subject = clientId) {
    const header = {
        alg: 'HS256',
        typ: 'JWT',
    };
    const payload = {
        iss: issuer, // The issuer of the JWT token
        sub: subject, // The subject of the JWT token
        aud: audience, // The audience of the JWT token
        exp: Math.floor(Date.now() / 1000) + (expirationInMinutes * 60), // The expiration time of the JWT token in seconds
        iat: Math.floor(Date.now() / 1000), // The issuing time of the JWT token in seconds
    };
    const secretKey = process.env.REACT_APP_JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined in the environment variables');
    }
    /**
     * Base64Url encodes the given input.
     *
     * @param {string | ArrayBuffer} input The input to encode
     * @returns {string} The Base64Url encoded input
     */
    const base64UrlEncode = (input) => {
        return input.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    };
    /**
     * Signs the given message using the HMAC SHA-256 algorithm.
     *
     * @param {string} message The message to sign
     * @param {string} secretKey The secret key to use for signing
     * @returns {Promise<Uint8Array>} The signed message
     */
    const hmacSha256 = (message, secret) => __awaiter(void 0, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const key = encoder.encode(secret);
        const data = encoder.encode(message);
        const algorithm = { name: 'HMAC', hash: 'SHA-256' };
        const cryptoKey = yield crypto.subtle.importKey('raw', key, algorithm, false, ['sign']);
        const signature = yield crypto.subtle.sign(algorithm.name, cryptoKey, data);
        return new Uint8Array(signature);
    });
    /**
     * Signs the given header and payload with the given secret key.
     *
     * @param {any} header The header of the JWT token
     * @param {any} payload The payload of the JWT token
     * @param {string} secretKey The secret key to use for signing
     * @returns {Promise<string>} The signed JWT token
     */
    const sign = (header, payload, secretKey) => __awaiter(void 0, void 0, void 0, function* () {
        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));
        const signature = yield hmacSha256(`${encodedHeader}.${encodedPayload}`, secretKey);
        const encodedSignature = base64UrlEncode(signature);
        return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
    });
    return yield sign(header, payload, secretKey);
});
exports.generateJWTToken = generateJWTToken;
/**
 * Generates a JWT token using the JOSE library.
 *
 * @param {string} clientId The client ID of the application
 * @param {string} audience The audience of the JWT token
 * @param {number} [expirationInMinutes=60] The expiration time of the JWT token in minutes
 * @param {string} [issuer=clientId] The issuer of the JWT token
 * @param {string} [subject=clientId] The subject of the JWT token
 * @returns {Promise<string>} The signed JWT token
 */
const generateJoseJWTToken = (clientId_2, audience_2, ...args_2) => __awaiter(void 0, [clientId_2, audience_2, ...args_2], void 0, function* (clientId, audience, expirationInMinutes = 60, issuer = clientId, subject = clientId) {
    const header = {
        alg: 'RS256', // Use RS256 for signing with a private key.
        typ: 'JWT', // The type of the JWT token
    };
    const payload = {
        iss: issuer, // The issuer of the JWT token
        sub: subject, // The subject of the JWT token
        aud: audience, // The audience of the JWT token
        jti: "_gKXrlMgPvTOUN5oz4vYJ", // JWT ID
        nbf: Math.floor(Date.now() / 1000), // Not before timestamp
        exp: Math.floor(Date.now() / 1000) + (expirationInMinutes * 60), // The expiration time of the JWT token in seconds
        iat: Math.floor(Date.now() / 1000), // The issuing time of the JWT token in seconds
    };
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) {
        throw new Error('JWT secret key is not defined in the environment variables');
    }
    // Sign the payload with the private key
    try {
        const jwt = yield new jose.SignJWT(payload)
            .setProtectedHeader(header) // Set the header with the algorithm and type
            .setIssuedAt(payload.iat) // Set the issued at time
            .setExpirationTime(payload.exp) // Set the expiration time
            .sign(new TextEncoder().encode(secretKey)); // Sign the payload with the private key
        return jwt; // Return the signed JWT token
    }
    catch (error) {
        console.error('Error generating JWT:', error); // Log the error
        throw error; // Re-throw the error
    }
});
exports.generateJoseJWTToken = generateJoseJWTToken;
/**
 * Signs a JWT token using a private key.
 *
 * @param {string} clientId The client ID of the application
 * @param {string} audience The audience of the JWT token
 * @param {number} [expirationInMinutes=60] The expiration time of the JWT token in minutes
 * @param {string} [issuer=clientId] The issuer of the JWT token
 * @param {string} [subject=clientId] The subject of the JWT token
 * @returns {Promise<string>} The signed JWT token
 */
const signJWTToken = (clientId_3, audience_3, ...args_3) => __awaiter(void 0, [clientId_3, audience_3, ...args_3], void 0, function* (clientId, audience, expirationInMinutes = 60, issuer = clientId, subject = clientId) {
    try {
        // Read the private key from the environment variables
        const key = process.env.JWT_PRIVATE_KEY;
        if (!key) {
            throw new Error('JWT private key is not defined in the environment variables');
        }
        //extract the JWK into a private key pem
        const privateKey = yield (0, exports.extractPrivatePublicKey)('private');
        // Convert the private key to a Uint8Array
        const privateKeyUint8Array = new TextEncoder().encode(privateKey);
        // Decode the private key from UTF-8 to a string
        const privateKeyString = new TextDecoder().decode(privateKeyUint8Array);
        // Create the JWT payload
        const payload = {
            iat: Math.floor(Date.now() / 1000), // Issued at timestamp
            nbf: Math.floor(Date.now() / 1000), // Not before timestamp
            exp: Math.floor(Date.now() / 1000) + (expirationInMinutes * 60), // Expiration timestamp
            jti: "_gKXrlMgPvTOUN5oz4vYJ", // JWT ID
            sub: subject, // Subject of the JWT token
            iss: issuer, // Issuer of the JWT token
            aud: audience, // Audience of the JWT token
        };
        ;
        // Import the private key to a JWK
        const privateKeyJWK = yield (0, jose_2.importPKCS8)(privateKeyString, 'RS256');
        // Create a SignJWT object
        const token = yield new jose_1.SignJWT(payload)
            // Set the algorithm to RS256
            .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
            // Set the issued at and expiration time
            .setIssuedAt()
            .setExpirationTime(Math.floor(Date.now() / 1000) + (expirationInMinutes * 60))
            // Sign the token with the private key
            .sign(privateKeyJWK);
        // Return the signed JWT token
        return token;
    }
    catch (error) {
        console.error('Error signing JWT token:', error);
        throw error;
    }
});
exports.signJWTToken = signJWTToken;
/**
 * Decodes a JWT token using the JOSE library with an HMAC SHA-256
 * algorithm for signing and verifying.
 *
 * @param {string} jwtToken The JWT token to be decoded
 * @returns {Promise<object>} The decoded payload of the JWT token
 */
const decodeJoseJWTToken = (jwtToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Generate a 256-bit HMAC SHA-256 key for signing and verifying
        const key = yield crypto.subtle.generateKey({ name: 'HMAC', hash: 'SHA-256' }, // The algorithm name and hash algorithm
        true, // Whether the key is extractable (i.e. can be exported)
        ['sign', 'verify'] // The key usages (e.g. signing, verifying)
        );
        // Verify the JWT token and return the decoded payload
        const decoded = yield jose.jwtVerify(jwtToken, key, {
            algorithms: ['RS256'], // The allowed signing algorithms
        });
        // Return the decoded payload
        return decoded;
    }
    catch (error) {
        // Log the error and re-throw it
        console.error('Error decoding JWT token:', error);
        throw error;
    }
});
exports.decodeJoseJWTToken = decodeJoseJWTToken;
/**
 * Decodes a JWT token using the JOSE library.
 *
 * @param {string} jwtToken The JWT token to be decoded
 * @param {string} publicKey The public key to be used for verifying the token's signature
 * @returns {Promise<object>} The decoded payload of the JWT token
 */
const decodeJWTToken = (jwtToken) => __awaiter(void 0, void 0, void 0, function* () {
    //public key
    const key = process.env.JWT_PUBLIC_KEY;
    if (!key) {
        throw new Error('JWT secret key is not defined in the environment variables');
    }
    const publicKeyPEM = yield (0, exports.extractPrivatePublicKey)('public');
    // Decode the JWT token using the provided public key
    try {
        const publicKey = yield (0, jose_2.importPKCS8)(Buffer.from(publicKeyPEM, 'base64').toString('binary'), 'RS256');
        // Decode the JWT token using the provided public key
        const { payload } = yield jose.jwtVerify(jwtToken, publicKey, {
            algorithms: ['RS256'], // The allowed signing algorithms
        });
        return payload; // Return the decoded payload
    }
    catch (error) {
        console.error('Error decoding JWT token:', error); // Log the error and re-throw it
        throw error;
    }
});
exports.decodeJWTToken = decodeJWTToken;
const extractPrivatePublicKey = (type) => __awaiter(void 0, void 0, void 0, function* () {
    const Key = process.env.JWT_PRIVATE_KEY;
    if (!Key) {
        throw new Error('JWT private key is not defined in the environment variables');
    }
    const privateKeyJWK = JSON.parse(Key);
    const publicPEM = jwkToPem(privateKeyJWK);
    const privatePEM = jwkToPem(privateKeyJWK, { private: true });
    if (type === "public") {
        return publicPEM;
    }
    else if (type === "private") {
        return privatePEM;
    }
    else {
        throw new Error('Invalid key type. Must be "public" or "private".');
    }
});
exports.extractPrivatePublicKey = extractPrivatePublicKey;
const decodeToken = (jwtToken) => __awaiter(void 0, void 0, void 0, function* () {
    //public key
    const base64Url = jwtToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(Buffer.from(base64, 'base64').toString());
    const payload = JSON.parse(jsonPayload);
    return payload;
});
exports.decodeToken = decodeToken;
