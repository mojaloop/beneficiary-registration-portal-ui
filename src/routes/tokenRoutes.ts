import { Router } from 'express';
import express from 'express';
const router: Router = express.Router();

import { Request, Response } from 'express';
import { decodeToken, signJWTToken } from '../services/JWTService';
import { GetParties, compareKYCData, fetchUserData, getUserToken, registerAccount, registerToken } from '../controllers/TokenController';
import { SaveDataToDB } from '../services/SaveService';
import dotenv from 'dotenv';
import { KYCInformation } from '../models/KYCInformation';
import { KYCData } from '../models/KYCData';

dotenv.config();

// Environment variables
const {
  CLIENT_ID,
  ESIGNET_TOKEN_URL,
  RETURN_URL,
  PAYMENT_ADAPTER_URL,
  MOJALOOP_GETPARTIES_URL,
} = process.env;


// Ensure all required environment variables are defined
if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !PAYMENT_ADAPTER_URL || !MOJALOOP_GETPARTIES_URL) {
  console.error('One or more required environment variables are not defined');
  process.exit(1);
}



// Get user info endpoint
// This endpoint is called by the frontend to get the user information and
// register a token and account with the payment adapter.
// The user is verified against the information stored in the MojaLoo SDK
// and if the information matches, a token and account are registered with
// the payment adapter and the information is saved to the database.
// The response will contain the user's name and the token data.
router.post('/', async (req: Request, res: Response) => {
  // todo: add API spec (input params and types), add validation
  try {
    // Get environment variables
    const { CLIENT_ID, ESIGNET_TOKEN_URL, RETURN_URL, MOJALOOP_GETPARTIES_URL } = process.env;

    // Ensure all required environment variables are defined
    // todo: should be checked only once on server start
    if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !MOJALOOP_GETPARTIES_URL) {
      console.error('One or more required environment variables are not defined');
      return res.status(500).json({ error: 'Environment variables not defined' });
    }

    // Generate JWT token
    const jwtToken = await signJWTToken(CLIENT_ID, ESIGNET_TOKEN_URL);
    if (!jwtToken) {
      return res.status(500).json({ error: 'Error generating JWT token' });
    }

    // Get ESigNet token
    const esignetToken = await getUserToken(req.body.code, CLIENT_ID, jwtToken, RETURN_URL);
    if (esignetToken.error) {
      return res.status(500).json({ error: 'Error getting ESigNet token' });
    }

    // Get user data
    const userToken = await fetchUserData(esignetToken);
    if (userToken.error) {
      return res.status(500).json({ error: 'Error fetching user data' });
    }

    // Decode user token
    const userTokenData = await decodeToken(userToken);
    if (!userTokenData) {
      return res.status(500).json({ error: 'Error decoding user token' });
    }

    // Create user data object
    const userData = new KYCInformation(userTokenData);

    // Get party information from MojaLoo SDK
    const getPatiesData = await GetParties(req.body.selectedPaymentType, req.body.payeeId);
    if (getPatiesData.error) {
      return res.status(500).json({ error: 'Error fetching user data from SDK' });
    }

    // Create party data object
    const kycData = new KYCData(getPatiesData.kycData);

    // Compare user and party information
    const isMatch = await compareKYCData(userData, kycData);
    if (!isMatch) {
      return res.status(400).json({ error: 'KYC information does not match' });
    }

    // Register token and account with the payment adapter
    const token = await registerToken(req.body.selectedPaymentType, req.body.payeeId, userData.sub);
    if (!token) {
      return res.status(500).json({ error: 'Error registering token' });
    }

    const account = await registerAccount(req.body.selectedPaymentType, req.body.payeeId);
    if (!account) {
      return res.status(500).json({ error: 'Error registering account' });
    }

    // Save token data to the database
    const tokenData = { psut: userData.sub, token };
    const success = await SaveDataToDB(tokenData);
    if (success) {
      return res.json({ name: userData.name, tokenData });
    } else {
      return res.status(500).json({ error: 'Failed to save data' });
    }
  } catch (error) {
    console.error('An error occurred while fetching party details:', error);
    return res.status(500).json({ error: "An error occurred while fetching beneficiary details:" });
  }
});

module.exports = router;
