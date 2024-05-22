import { json } from 'stream/consumers';
import { error } from 'console';
import { KYCInformation } from '../models/KYCInformation';
import { KYCData } from '../models/KYCData';

const mojaloopUrl = "http://192.168.1.55" // todo: remove this hardcoded value
//get user info from esignet

/**
 * Fetches user information from eSignet
 *
 * @param {string} code The code obtained from eSignet
 * @param {string} clientId The client ID of the app
 * @param {string} grant_type The grant type to be used
 * @param {string} redirect_uri The redirect URI of the app
 * @returns {Promise<string | null>} The JSON response from eSignet or null in case of error
 */
export const GetUserInfo = async (
  code: string,
  clientId: string,
  grant_type: string,
  redirect_uri: string
): Promise<string | null> => {

  const apiUrl = `${mojaloopUrl}:3000/tokens`; // eSignet API endpoint
  const requestBody = {
    clientId: clientId,
    code: code,
    grant_type: grant_type,
    redirect_uri: redirect_uri
  }; // Request body to be sent to eSignet

  try {
    //await axios.post(apiUrl, requestBody); // Uncomment this if using axios

    const response = await fetch(apiUrl, { // Send POST request to eSignet API
        method: 'POST',
        mode: 'no-cors', // Disable CORS to avoid any issues
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    //alert('The token has been registered'); // Uncomment this if needed
    const result = await response.json(); // Parse the response as JSON
    return result;

  } catch (error) {
    console.error('Error registering token:', error); // Log error
    return null;
  }
};


/**
 * Register a new account with the MojaLoop account service.
 *
 * @param {string} idType - The type of the account holder's ID
 * @param {string} payeeId - The account holder's ID
 * @param {string} idToken - The ID token obtained from eSignet
 * @returns {Promise<string | null>} The modelId of the newly registered account, or null if registration failed
 */
export const registerToken = async (
  idType: string,
  payeeId: string,
  psut: string
): Promise<string | null> => {

  const token = await generateRandomToken(psut);

  const tokenAdapterUrl = process.env.PAYMENT_ADAPTER_URL;

  if(!tokenAdapterUrl){
throw error('PAYMENT_ADAPTER_URL not defined');
  }
  const apiUrl = `${tokenAdapterUrl}/tokens`; // MojaLoop API endpoint
  const requestBody = {
    payeeId: payeeId,
    payeeIdType: idType,
    paymentToken: token
  }; // Request body to be sent to MojaLoop

  try {
    //await axios.post(apiUrl, requestBody); // Uncomment this if using axios

    const response = await fetch(apiUrl, { // Send POST request to MojaLoop API
        method: 'POST',
        mode: 'no-cors', // Disable CORS to avoid any issues
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    //alert('The token has been registered'); // Uncomment this if needed

    return token;

  } catch (error) {
    console.error('Error registering token:', error); // Log error
    return null;
  }
};


/**
 * Register a new account with the MojaLoop account service.
 *
 * @param {string} idType - The type of the account holder's ID
 * @param {string} payeeId - The account holder's ID
 * @returns {string | null} The modelId of the newly registered account, or null if registration failed
 */
export const registerAccount = async (idType: string, payeeId: string): Promise<string | null> => {

  const tokenAdapterUrl = process.env.MOJALOOP_SDK_URL;

  if(!tokenAdapterUrl){
throw error('MOJALOOP_GETPARTIES_URL not defined');
  }
  const apiUrl = `${tokenAdapterUrl}accounts`;
  const requestBody = [
    {
      /**
       * Type of the account holder's ID.
       * Currently only "ALIAS" is supported.
       */
      idType: "ALIAS",
      /**
       * The account holder's ID.
       * This will be used as the alias for the account.
       */
      idValue: payeeId,
      /**
       * The currency code of the account.
       * Currently only "ZMW" is supported.
       */
      currency: "ZMW"
    }
  ];

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    // No need for .json() here as it's a non-CORS request
    const responseData = await response.json();


    // Assuming the response contains the modelId
    const modelId: string = responseData.modelId;

    // Return the generated token
    return modelId;

    /**
     * If the response is successful, return a success message or relevant data.
     * In this case, we return the modelId of the newly registered account.
     */
  } catch (error) {
    console.error('Error registering account:', error);
    /**
     * If the response is not successful, handle the error.
     * In this case, we return null to indicate that account registration failed.
     */
    return null;
  }
};




/**
 * Generate a random token based on the given ID token.
 *
 * @param {string} idToken - The ID token to use as the basis for the random token
 * @returns {string} The generated random token
 */
const generateRandomToken = async (idToken: string): Promise<string> => {

  // The characters to use for generating the random token
  const characters = idToken;
  // The length of the random token to generate
  const length = 10;
  let result = '';
  // Build the random token one character at a time
  for (let i = 0; i < length; i++) {
    // Get a random character from the given ID token
    const randomChar = characters.charAt(Math.floor(Math.random() * characters.length));
    // Add the random character to the result
    result += randomChar;
  }
  // Return the generated random token
  return result;
};

/**
 * Fetches the user token from the eSignet OAuth2 server
 *
 * @param {string} code - The authorization code
 * @param {string} client_id - The client ID
 * @param {string} client_assertion - The client assertion
 * @param {string} redirect_uri - The redirect URI
 * @returns {any} The JSON object containing the user token
 */
export const getUserToken = async (
  code: string,
  client_id: string,
  client_assertion: string,
  redirect_uri: string
): Promise<any> => {
  // The URL to fetch the user token from
  const url = process.env.ESIGNET_TOKEN_URL as string;

  if (!url) {
    throw new Error('JWT private key is not defined in the environment variables');
  }

  try {


    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    const body = new URLSearchParams({
      'grant_type': 'authorization_code',
      'code': code, // Replace with your actual code
      'client_id': client_id, // Replace with your actual client_id
      'client_assertion_type': 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer', // Replace with your actual client_assertion_type
      'client_assertion': client_assertion, // Replace with your actual client_assertion
      'redirect_uri': "http://localhost:3007" // todo: remove this hardcoded value
    });

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    if (!response.ok) {
      const error = await response.json();


      return { error: `Failed to fetch user token: ${error.error_description || response.statusText}` };
    }

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error('Error fetching user token:', error);
    return { error: 'Error fetching user token' };
  }
};


/**
 * Fetches user data from the identity provider
 * @param token - Access token to be used for fetching user data
 * @returns Parsed JSON object containing the user's data
 */
export const fetchUserData = async (token: string): Promise<any> => {
  // URL for fetching user data
  const url = process.env.ESIGNET_USERINFO_URL;

  try {
    if (!url) {
      return { error: 'URL not defined' };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Use the provided access token
    };

    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      const errorMessage = `Failed to fetch: ${response.status} ${response.statusText}`;
      console.error("errorMessage", errorMessage);
      return { error: errorMessage };
    }

    const data = await response.text(); // Parse the response as text (assuming it's a token)

    return data; // Return the token
  } catch (error) {
    console.error('Error:', error);
    return { error: 'Failed to fetch' };
  }
}



export const compareKYCData = async (
  kycInfo: KYCInformation,
  kycData: any) => {

  let match = true;
  const {
    REACT_APP_KYC_PROPERTIES_TO_COMPARE
  } = process.env;

// Ensure all required environment variables are defined
if ( !REACT_APP_KYC_PROPERTIES_TO_COMPARE) {
  console.error('One required environment variable are not defined');
  process.exit(1);
}

  const kycPropertiesToCompare = REACT_APP_KYC_PROPERTIES_TO_COMPARE.split(',') as Array<
  keyof KYCInformation | keyof KYCData>;
if (!kycPropertiesToCompare.length) {
  return { error: 'No KYC properties to compare' };
}

  for (const prop of kycPropertiesToCompare) {
    const kycInfoValue = (kycInfo as any)[prop];
    const kycDataValue = (kycData as any)[prop];

    if (kycInfoValue !== kycDataValue) {
      match = false;
      console.log(`${prop} does not match`);
    }
  }

  if (match) {
      return true;
  } else {
       return false;
  }
};

export const GetParties = async (selectedPaymentType: string, payeeId: string) : Promise <any> => {
  try {
    const {  MOJALOOP_GETPARTIES_URL } = process.env;

    // Ensure all required environment variables are defined
    if (!MOJALOOP_GETPARTIES_URL) {
      return { error: 'Environment variables not defined' };
    }

    const apiUrl = `${MOJALOOP_GETPARTIES_URL}/parties/${selectedPaymentType}/${payeeId}`;

    const response = await fetch(apiUrl);
    if (!response.ok)
      return { error: `Failed to fetch data due to ${response.status} ${response.statusText}` };

    const { kycInformation } = await response.json();
    const kycData = JSON.parse(kycInformation).data;


    return { kycData };

  }catch  (error){
    console.error('Error:', error);
    return { error: 'Failed to fetch from payment adapter' };
  }

}


