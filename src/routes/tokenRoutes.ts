import { Router } from 'express';
import express from 'express';
const router: Router = express.Router();

import { Request, Response } from 'express';
import { decodeToken, signJWTToken } from '../services/JWTService';
import { GetParties, compareKYCData, fetchUserData, getUserToken, registerAccount, registerToken } from '../controllers/TokenController';
import { SaveDataToDB } from '../services/SaveService';
import dotenv from 'dotenv';
import { KYCInformation } from '../models/KYCInformation';
import { CURRENCY } from '../constants';
import { KYCData } from '../models/KYCData';

dotenv.config();

// Environment variables
const {
  CLIENT_ID,
  ESIGNET_TOKEN_URL,
  RETURN_URL,
} = process.env;
// todo: move to config or constants

// Ensure all required environment variables are defined
if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL) {
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
    // Generate JWT token
    const jwtToken = await signJWTToken(CLIENT_ID, ESIGNET_TOKEN_URL);
    if (!jwtToken) {
      console.error('no jwtToken');
      return res.status(500).json({ error: 'Error generating JWT token' });
    }

    // Get ESigNet token
    const esignetToken = await getUserToken(req.body.code, CLIENT_ID, jwtToken, RETURN_URL);
    if (esignetToken.error) {
      console.error('esignetToken error:', esignetToken);
      return res.status(500).json({ error: 'Error getting ESigNet token' });
    }

    // Get user data
    const userToken = await fetchUserData(esignetToken);
    if (userToken.error) {
      return res.status(500).json({ error: 'Error fetching user data' });
    }
    console.log('userToken is got');

    // Decode user token
    const userTokenData = await decodeToken(userToken);
    if (!userTokenData) {
      console.error('no userTokenData:', userTokenData);
      return res.status(500).json({ error: 'Error decoding user token' });
    }

    // Create user data object
    const userData = new KYCInformation(userTokenData);
    console.log('userData:', { ...userData, picture: null  });

    // Get party information from MojaLoo SDK
    const getPatiesData = await GetParties(req.body.selectedPaymentType, req.body.payeeId);
    if (getPatiesData.error) {
      return res.status(500).json({ error: 'Error fetching user data from SDK' });
    }

    // todo: move to a separate method
    const mlUserName = getPatiesData.party?.body?.name ?? '';
    if (!mlUserName || mlUserName !== userData.name) {
      const errMessage = 'User details from Mojaloop and MOSIP do not match!';
      console.error(errMessage, { mlUserName });
      return res.status(403).json({ error: errMessage });
    }

    // Create party data object
    // const kycData = new KYCData(getPatiesData.kycData);
    //
    // // Compare user and party information
    // const isMatch = await compareKYCData(userData, kycData);
    // if (!isMatch) {
    //   return res.status(400).json({ error: 'KYC information does not match' });
    // }

    // Register token and account with the payment adapter
    const token = await registerToken(req.body.selectedPaymentType, req.body.payeeId, userData.sub);
    if (!token) {
      return res.status(500).json({ error: 'Error registering token' });
    }

    const account = await registerAccount(token, CURRENCY);
    // todo: get CURRENCY from party response?
    if (!account) {
      return res.status(500).json({ error: 'Error registering account' });
    }

    // Save token data to the database
    const tokenData = { psut: userData.sub, token };
    const success = await SaveDataToDB(tokenData);
    console.log('success and tokenData:', { success, tokenData });

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
