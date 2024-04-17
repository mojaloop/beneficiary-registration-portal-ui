import * as jose from 'jose';
//import * as fs from 'fs';
import { promises as fs } from 'fs';
import { SignJWT } from 'jose';
import { importPKCS8 } from 'jose'
import jwt_decode from 'jwt-decode';


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
export const generateJWTToken = async (
  clientId: string,
  audience: string,
  expirationInMinutes = 60,
  issuer = clientId,
  subject = clientId
) => {
  const header: any = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const payload: any = {
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
  const base64UrlEncode = (input: string | ArrayBuffer) => {
    return input.toString().replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  /**
   * Signs the given message using the HMAC SHA-256 algorithm.
   *
   * @param {string} message The message to sign
   * @param {string} secretKey The secret key to use for signing
   * @returns {Promise<Uint8Array>} The signed message
   */
  const hmacSha256 = async (message: string, secret: string) => {
    const encoder = new TextEncoder();
    const key = encoder.encode(secret);
    const data = encoder.encode(message);

    const algorithm = { name: 'HMAC', hash: 'SHA-256' };
    const cryptoKey = await crypto.subtle.importKey('raw', key, algorithm, false, ['sign']);
    const signature = await crypto.subtle.sign(algorithm.name, cryptoKey, data);

    return new Uint8Array(signature);
  };

  /**
   * Signs the given header and payload with the given secret key.
   *
   * @param {any} header The header of the JWT token
   * @param {any} payload The payload of the JWT token
   * @param {string} secretKey The secret key to use for signing
   * @returns {Promise<string>} The signed JWT token
   */
  const sign = async (header: any, payload: any, secretKey: string) => {
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, secretKey);
    const encodedSignature = base64UrlEncode(signature);

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  };

  return await sign(header, payload, secretKey);
};



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
export const generateJoseJWTToken = async (
  clientId: string,
  audience: string,
  expirationInMinutes = 60,
  issuer = clientId,
  subject = clientId
) => {
  const header: any = {
    alg: 'RS256', // Use RS256 for signing with a private key.
    typ: 'JWT', // The type of the JWT token
  };

  const payload: any = {
    iss: issuer, // The issuer of the JWT token
    sub: subject, // The subject of the JWT token
    aud: audience, // The audience of the JWT token
    jti: "_gKXrlMgPvTOUN5oz4vYJ", // JWT ID
    nbf: Math.floor(Date.now() / 1000), // Not before timestamp
    exp: Math.floor(Date.now() / 1000) + (expirationInMinutes * 60), // The expiration time of the JWT token in seconds
    iat: Math.floor(Date.now() / 1000), // The issuing time of the JWT token in seconds
  };

  const secretKey = serverPrivateKey;

  if (!secretKey) {
    throw new Error('JWT secret key is not defined in the environment variables');
  }

  // Sign the payload with the private key
  try {
    const jwt = await new jose.SignJWT(payload)
      .setProtectedHeader(header) // Set the header with the algorithm and type
      .setIssuedAt(payload.iat) // Set the issued at time
      .setExpirationTime(payload.exp) // Set the expiration time
      .sign(new TextEncoder().encode(secretKey)); // Sign the payload with the private key

      console.log("JWT",jwt)
    return jwt; // Return the signed JWT token
  } catch (error) {
    console.error('Error generating JWT:', error); // Log the error
    throw error; // Re-throw the error
  }
};


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
export const signJWTToken = async (
  clientId: string,
  audience: string,
  expirationInMinutes = 60,
  issuer = clientId,
  subject = clientId
): Promise<string> => {
  try {
    // Read the private key from the environment variables
    const privateKey = serverPrivateKey;

    if (!privateKey) {
      throw new Error('JWT private key is not defined in the environment variables');
    }

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

    // Log the payload for debugging
    console.log(payload);

    // Import the private key to a JWK
    const privateKeyJWK = await importPKCS8(privateKeyString, 'RS256');

    // Create a SignJWT object
    const token = await new SignJWT(payload)
      // Set the algorithm to RS256
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      // Set the issued at and expiration time
      .setIssuedAt()
      .setExpirationTime(Math.floor(Date.now() / 1000) + (expirationInMinutes * 60))
      // Sign the token with the private key
      .sign(privateKeyJWK);

    // Log the token for debugging
    console.log("token assertion", token);

    // Return the signed JWT token
    return token;

  } catch (error) {
    console.error('Error signing JWT token:', error);
    throw error;
  }
};



/**
 * Decodes a JWT token using the JOSE library with an HMAC SHA-256
 * algorithm for signing and verifying.
 *
 * @param {string} jwtToken The JWT token to be decoded
 * @returns {Promise<object>} The decoded payload of the JWT token
 */
export const decodeJoseJWTToken = async (jwtToken: string) => {
  try {
    // Generate a 256-bit HMAC SHA-256 key for signing and verifying
    const key = await crypto.subtle.generateKey(
      { name: 'HMAC', hash: 'SHA-256' }, // The algorithm name and hash algorithm
      true, // Whether the key is extractable (i.e. can be exported)
      ['sign', 'verify'] // The key usages (e.g. signing, verifying)
    );

    // Verify the JWT token and return the decoded payload
    const decoded = await jose.jwtVerify(jwtToken, key, {
      algorithms: ['RS256'], // The allowed signing algorithms
    });

    // Log the decoded payload for debugging
    console.log(decoded);

    // Return the decoded payload
    return decoded;

  } catch (error) {
    // Log the error and re-throw it
    console.error('Error decoding JWT token:', error);
    throw error;
  }
};


/**
 * Decodes a JWT token using the JOSE library.
 *
 * @param {string} jwtToken The JWT token to be decoded
 * @param {string} publicKey The public key to be used for verifying the token's signature
 * @returns {Promise<object>} The decoded payload of the JWT token
 */
export const decodeJWTToken = async (jwtToken: string) => {
  //public key
  const publicKey = serverPublicKey;

  if (!publicKey) {
    throw new Error('JWT secret key is not defined in the environment variables');
  }

  
  // Decode the JWT token using the provided public key
  try {
    const key = await importPKCS8(publicKey, 'RS256'); // Import the public key in PKCS#8 format
    const { payload } = await jose.jwtVerify(jwtToken, key, { // Verify the JWT token using the public key
      algorithms: ['RS256'], // The allowed signing algorithms
    });

    console.log(payload); // Log the decoded payload for debugging
    return payload; // Return the decoded payload

  } catch (error) {
    console.error('Error decoding JWT token:', error); // Log the error and re-throw it
    throw error;
  }
};


const serverPrivateKey = `-----BEGIN PRIVATE KEY-----
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
Zd0xRGUw25BPyz0y1LeR76veMW4whw==
-----END PRIVATE KEY-----`;

const serverPublicKey = ``;
