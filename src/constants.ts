
export const ID_TYPE_ALIAS = 'ALIAS';

export const {
    PTA_URL,
    MOJALOOP_GETPARTIES_URL,
    MOJALOOP_SDK_URL,
    ESIGNET_TOKEN_URL,
    ESIGNET_USERINFO_URL,
    CURRENCY = 'EUR',
} = process.env;
// todo: add convict to deal with env vars

if (!PTA_URL || !MOJALOOP_GETPARTIES_URL || !MOJALOOP_SDK_URL || !ESIGNET_TOKEN_URL || !ESIGNET_USERINFO_URL) {
    const errMessage = 'No required env vars!';
    console.error(errMessage, { PTA_URL, MOJALOOP_GETPARTIES_URL, MOJALOOP_SDK_URL, ESIGNET_TOKEN_URL });
    throw new Error(errMessage);
}