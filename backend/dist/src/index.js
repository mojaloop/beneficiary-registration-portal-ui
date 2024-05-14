"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
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
app.use('/getUserInfo', require('./routes/tokenRoutes'));
// Start server
const port = process.env.PORT || 8081;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
