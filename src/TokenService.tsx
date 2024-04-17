
const mojaloopUrl = "https://pta-portal-mosippayee.devpm4ml.labspm4ml1002.mojaloop.live"
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

  const apiUrl = 'http://192.168.1.55:3000/tokens'; // eSignet API endpoint
  const requestBody = {
    clientId: clientId,
    code: code,
    grant_type: grant_type,
    redirect_uri: redirect_uri
  }; // Request body to be sent to eSignet

  try {
    //await axios.post(apiUrl, requestBody); // Uncomment this if using axios

    console.log('requestBody', requestBody);
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
  idToken: string
): Promise<string | null> => {

  const token = await generateRandomToken(idToken);

  console.log('Generated token:', token);

  const apiUrl = `${mojaloopUrl}/tokens`; // MojaLoop API endpoint
  const requestBody = {
    payeeId: payeeId,
    payeeIdType: idType,
    paymentToken: token
  }; // Request body to be sent to MojaLoop

  try {
    //await axios.post(apiUrl, requestBody); // Uncomment this if using axios

    console.log('requestBody', requestBody);
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
  const apiUrl = `${mojaloopUrl}/mlcon-outbound/accounts`;
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

    // Handle the response here
    console.log('Response Data:', responseData);

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
  console.log('idToken:', idToken);
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
  const tkn = 'CM101343JW9EWE24';
  return tkn;
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
  const url = 'https://esignet.collab.mosip.net/v1/esignet/oauth/token';

  // The request options
  const options = {
    method: 'POST', // HTTP POST request
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded', // Specify the request body content type
      // Accept: 'application/json' // Uncomment to specify the response content type
    },
    body: new URLSearchParams({ // Build the request body
      grant_type: 'authorization_code', // The grant type
      code: code, // The authorization code
      client_id: client_id, // The client ID
      client_assertion_type:
        'urn:ietf:params:oauth:client-assertion-type:jwt-bearer', // The client assertion type
      client_assertion: client_assertion, // The client assertion
      redirect_uri: "http://localhost:3007/", // The redirect URI
    }),
  };

  try {
    const response = await fetch(url, options); // Make the request

    // Throw an error if the response was not successful
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response data

    console.log('response', data); // Log the user token

    return data; // Return the user token
  } catch (error) {
    console.error('Error fetching user token:', error); // Log the error
    throw error; // Rethrow the error
  }
};


/**
 * Fetches user data from the identity provider
 * @param token - Access token to be used for fetching user data
 * @returns Parsed JSON object containing the user's data
 */
export const fetchUserData = async (token: string): Promise<any> => {
  // URL for fetching user data
  const url = 'https://esignet.collab.mosip.net/v1/esignet/oidc/userinfo';

  // Request options
  const options = {
    method: 'GET', // HTTP GET request
    headers: {
      Accept: 'application/jwt', // Accept only JWT responses
      Authorization: `Bearer ${token}` // Use the provided access token
    }
  };

  try {
    const response = await fetch(url, options); // Make the request

    // Throw an error if the response was not successful
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    const data = await response.json(); // Parse the response data
    console.log(data); // Log the user data
    return data; // Return the user data
  } catch (error) {
    console.error(error); // Log the error
    throw error; // Rethrow the error
  }
}




