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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWTService_1 = require("./JWTService");
const TokenService_1 = require("./TokenService");
const saveDataToDB_1 = require("./saveDataToDB");
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Environment variables
const { CLIENT_ID, ESIGNET_TOKEN_URL, RETURN_URL, PAYMENT_ADAPTER_URL, MOJALOOP_GETPARTIES_URL, } = process.env;
// Ensure all required environment variables are defined
if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !PAYMENT_ADAPTER_URL || !MOJALOOP_GETPARTIES_URL) {
    console.error('One or more required environment variables are not defined');
    process.exit(1);
}
app.get('/', (req, res) => {
    return res.send('Hello, World!');
});
// Get user info endpoint
// This endpoint is called by the frontend to get the user information and
// register a token and account with the payment adapter.
// The user is verified against the information stored in the MojaLoo SDK
// and if the information matches, a token and account are registered with
// the payment adapter and the information is saved to the database.
// The response will contain the user's name and the token data.
app.post('/getUserInfo', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get environment variables
        const { CLIENT_ID, ESIGNET_TOKEN_URL, RETURN_URL, MOJALOOP_GETPARTIES_URL } = process.env;
        // Ensure all required environment variables are defined
        if (!CLIENT_ID || !ESIGNET_TOKEN_URL || !RETURN_URL || !MOJALOOP_GETPARTIES_URL) {
            console.error('One or more required environment variables are not defined');
            return res.status(500).json({ error: 'Environment variables not defined' });
        }
        // Generate JWT token
        const jwtToken = yield (0, JWTService_1.signJWTToken)(CLIENT_ID, ESIGNET_TOKEN_URL);
        if (!jwtToken) {
            return res.status(500).json({ error: 'Error generating JWT token' });
        }
        // Get ESigNet token
        const esignetToken = yield (0, TokenService_1.getUserToken)(req.body.code, CLIENT_ID, jwtToken, RETURN_URL);
        if (esignetToken.error) {
            return res.status(500).json({ error: 'Error getting ESigNet token' });
        }
        // Get user data
        const userToken = yield (0, TokenService_1.fetchUserData)(esignetToken);
        if (userToken.error) {
            return res.status(500).json({ error: 'Error fetching user data' });
        }
        // Decode user token
        const userTokenData = yield (0, JWTService_1.decodeToken)(userToken);
        if (!userTokenData) {
            return res.status(500).json({ error: 'Error decoding user token' });
        }
        // Create user data object
        const userData = new models_1.KYCInformation(userTokenData);
        // Get party information from MojaLoo SDK
        const getPatiesData = yield (0, TokenService_1.GetParties)(req.body.selectedPaymentType, req.body.payeeId);
        if (getPatiesData.error) {
            return res.status(500).json({ error: 'Error fetching user data from SDK' });
        }
        // Create party data object
        const kycData = new models_1.KYCData(getPatiesData.kycData);
        // Compare user and party information
        const isMatch = yield (0, TokenService_1.compareKYCData)(userData, kycData);
        if (!isMatch) {
            return res.status(400).json({ error: 'KYC information does not match' });
        }
        // Register token and account with the payment adapter
        const token = yield (0, TokenService_1.registerToken)(req.body.selectedPaymentType, req.body.payeeId, userData.sub);
        if (!token) {
            return res.status(500).json({ error: 'Error registering token' });
        }
        const account = yield (0, TokenService_1.registerAccount)(req.body.selectedPaymentType, req.body.payeeId);
        if (!account) {
            return res.status(500).json({ error: 'Error registering account' });
        }
        // Save token data to the database
        const tokenData = { psut: userData.sub, token };
        const success = yield (0, saveDataToDB_1.SaveDataToDB)(tokenData);
        if (success) {
            return res.json({ name: userData.name, tokenData });
        }
        else {
            return res.status(500).json({ error: 'Failed to save data' });
        }
    }
    catch (error) {
        console.error('An error occurred while fetching party details:', error);
        return res.status(500).json({ error: "An error occurred while fetching beneficiary details:" });
    }
}));
// Start server
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
