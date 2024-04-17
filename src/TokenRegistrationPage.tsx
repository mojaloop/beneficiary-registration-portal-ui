import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
//import redis from 'redis';

import Header from './Header';
import { fetchUserData, getUserToken, registerAccount, registerToken } from './TokenService';
import { decodeJWTToken, generateJWTToken, generateJoseJWTToken, signJWTToken } from './JWTService';
//import {  saveKYCInfoToRedis } from './SaveToRedis';

//payment type
const paymentTypes = [
  { type: 'MSISDN', name: 'Mobile Number' },
  { type: 'ACCOUNT_NO', name: 'Account Number' },
  { type: 'EMAIL', name: 'Email' },
  { type: 'PERSONAL_ID', name: 'Personal ID' },
  { type: 'BUSINESS', name: 'Business' },
  { type: 'DEVICE', name: 'Device' },
  { type: 'ACCOUNT_ID', name: 'Account ID' },
  { type: 'IBAN', name: 'IBAN' },
  { type: 'ALIAS', name: 'Alias' }
];


const mojaloopUrl = "https://pta-portal-mosippayee.devpm4ml.labspm4ml1002.mojaloop.live"


const TokenRegistrationPage: React.FC = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean | null>(null);
  const [accountPosted, setAccountPosted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  
  interface KYCData {
    name: string;
    dob: string;
    gender: string;
    address: string;
    email: string;
    phone: string;
    nationality: string;
    passport_number: string;
    issue_date: string;
    expiry_date: string;
    bank_account_number: string;
    bank_name: string;
    employer: string;
    occupation: string;
    income: string;
    marital_status: string;
    dependents: number;
    risk_level: string;
  }
  
  interface ResponseData {
    kycInformation: string;
  }
  
  class KYCInformation {
    sub: string;
    birthdate: string;
    address: {
      locality: string;
    };
    gender: string;
    name: string;
    phone_number: string;
    email: string;
    picture: string;
  
    constructor(data: any) {
       this.sub = data.sub || '';
       this.birthdate = data.birthdate || '';
       this.address = data.address ? { locality: data.address.locality || '' } : { locality: '' };
       this.gender = data.gender || '';
       this.name = data.name || '';
       this.phone_number = data.phone_number || '';
      this.email = data.email || '';
       this.picture = data.picture || '';
     } 
  }

  

  const [userData, setUserData] = useState<KYCInformation | null>(null);

  useEffect(() => {
    /**
     * Fetches data from the authorization server after the redirect
     * 
     * This function gets the code, state, and nonce from the query
     * parameters of the URL and uses them to generate a JWT token,
     * which is then used to get an access token from the authorization
     * server, which is then used to fetch the user's data.
     */
    const fetchData = async () => {
      // Get the current URL
      const currentUrl = window.location.href;

      // Get individual parameters from the URL
      const searchParams = new URLSearchParams(window.location.search);
      const nonce = searchParams.get('nonce');
      const state = searchParams.get('state');
      const code = searchParams.get('code');

      // Check if code is not null before proceeding
      if (code !== null && nonce !== null && state !== null) {
        // Set up client ID, redirect URL, and user code for request
        const clientId = 'XaOVhjFTX_H8UiZf-O1TuV4ChixshdO8RqghtA_cRUM';
        const redirectUrl = encodeURIComponent('http://localhost:3007/');
        const userCode = code;

        // Set audience and token endpoint for request
        const audience = 'https://esignet.collab.mosip.net/v1/esignet/oauth/token';
        const tokenEndpoint = 'https://esignet.collab.mosip.net/v1/esignet/oauth/v2/token';

        try {
          // Generate JWT token
          const jwtToken = await signJWTToken(clientId, audience);

          // If successful, get access token
          const token = await getUserToken(code, clientId, jwtToken, redirectUrl);

          // If successful, fetch user data
          const userToken = await fetchUserData(token);

          // If successful, decode token which contains user information
          const userTokenData = await decodeJWTToken(userToken);

          // Create object with user data
          const userData: KYCInformation = new KYCInformation(userTokenData);
          
          setUserData(userData);

          // Save KYC information to Redis
         // await saveKYCInfoToRedis(userData);

          console.log('User data:', userData);

        } catch (error) {
          console.error('Error generating JWT token:', error);
        }
      } else {
        console.error('Code is null'); // Handle the case where code is null
      }
    };
  
    fetchData(); // Call the async function immediately
  
    // No cleanup needed, so return undefined
    return;
  }, []); // Dependency array is empty since there are no dependencies for this effect


  const navigate = useNavigate();
  
  
  
  
  // Example usage:
  const jsonData = {
    "sub": "346717934331904843944838278198338358",
    "birthdate": "1982/02/13",
    "address": {
      "locality": "Kenitra"
    },
    "gender": "Male",
    "name": "ohn Doe",
    "phone_number": "7550166813",
    "email": "johndoe@example.com",
    "picture": ""
  };
  
 // const kycInfo = new KYCInformation(jsonData);
  
  //console.log(kycInfo);
  
  // Assuming response contains the API response
  const responseData = {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsImtleV9pZCI6IjEyMzQ1Njc4OTAifQ.QM1f2ZvWaV1US6P1wNBguzce7HAjmWzB2HsZVIkXwJeLEuBv2ZYvxsaYwTGnqFfVOVtD45Zp5_KZm98QR5AXEw",
    "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDI2MjIsImtleV9pZCI6IjEyMzQ1Njc4OTAifQ.QM1f2ZvWaV1US6P1wNBguzce7HAjmWzB2HsZVIkXwJeLEuBv2ZYvxsaYwTGnqFfVOVtD45Zp5_KZm98QR5AXEw",
    "token_type": "Bearer",
    "expires_in": 3600,
    "scope": "openid profile email",
    "user_info": {
      "sub": "1234567890",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "phone_number": "+1 555-123-4567",
      "date_of_birth": "1980-05-15",
      "passportNumber": "AB1234567",
      "address": "123 Main Street, Anytown, USA",
      "kyc_status": "verified",
      "kyc_data": {
        "id_type": "passport",
        "id_number": "ABC123456",
        "id_expiration": "2025-12-31"
      }
    }
  };
  
  //const kycInfo = new KYCInformation(responseData);
 
  
   // Comparison logic goes here
   const compareKYCData = useCallback(async(kycInfo: KYCInformation, kycData: KYCData, selectedPaymentType: string, payeeId: string) => {
    // Initialize a variable to store whether KYC data matches
    let match = true;
  
    // Compare relevant fields
    if (kycInfo.name !== kycData.name) {
      match = false;
      console.log('Name does not match');
    }
    if (kycInfo.birthdate !== kycData.dob) {
      match = false;
      console.log('Date of Birth does not match');
    }
    if (kycInfo.email !== kycData.email) {
      match = false;
      console.log('Email does not match');
    }
    if (kycInfo.phone_number !== kycData.phone) {
      match = false;
      console.log('Phone Number does not match');
    }
    if (
      kycInfo.address.locality !== kycData.address 
    ) {
      match = false;
      console.log('Address does not match');
    }
    if (
      kycInfo.gender !== kycData.gender
    ) {
      match = false;
      console.log('KYC Data does not match');
    }
  
    // Log the result of comparison
    if (match) {
      console.log('KYC Data Matches');
      setIsMatch(true);


      
      //register token
    const token = await registerToken(selectedPaymentType, payeeId, kycInfo.sub);

    setLoading(false);

    setIsLoading(false);

    if (token) {

      setIsRegistered(true);

      setIsGenerated(true);

    } else {

      setIsRegistered(false);

      setIsGenerated(false);
      
    }

    const account = await registerAccount(selectedPaymentType, payeeId);

    setLoading(false);

    setIsLoading(false);

    if (token) {

      setAccountPosted(true);

    } else {

      setAccountPosted(false);

    }


      //await storeKYCInformationInRedis(kycInfo);
    } else {
      console.log('KYC Data Does Not Match');
      setIsMatch(false);
    }
  }, []);
  
  /**
   * Fetches KYC information from the switch based on the selected
   * payment type and payee ID.
   */
  const handleGetParties = async () => {
    try {
      const apiUrl = `http://localhost:3001/parties/${selectedPaymentType}/${payeeId}`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const { kycInformation }: ResponseData = await response.json();
      const kycData: KYCData = JSON.parse(kycInformation).data;

      // Log the serialized KYC data received from the switch
      console.log('Serialized KYC data:', kycData);
      
      // get data from redis
      if (!userData) {
        console.log('User Data is nulll');
        return;
      }

      //const kycInfo = getKYCInfoFromRedis(userData.sub);


      // Compare KYC data after fetching
      compareKYCData(userData, kycData, selectedPaymentType, payeeId);
    } catch (error) {
      // Log an error if an exception occurs while fetching KYC information
      console.error('An error occurred while fetching party details:', error);
    }
  };


  /**
   * Handle form submission
   * 
   * Fetches KYC information from the switch, compares it with the
   * KYC information provided by the user, and redirects the user
   * to the registered beneficiaries page if the data matches.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);

    /**
     * Fetch KYC information from the switch based on the selected
     * payment type and payee ID
     */
    await handleGetParties();

    /**
     * Set the loading state to false, indicating that the form
     * is no longer submitting
     */
    setLoading(false);

    /**
     * Set the isLoading state to false, indicating that the
     * fetching of KYC information is complete
     */
    setIsLoading(false);
  };


  /**
   * Handle redirection to the registered beneficiaries page
   * 
   * This function assumes that the userIdType and generatedToken are
   * available. It constructs a URL, sends a GET request to the URL,
   * and redirects the user to the registered beneficiaries page.
   */
  const handleRedirect = async () => {
    const userIdType = selectedPaymentType;
    const generatedToken = 'token'; // Replace 'token' with the actual generated token

    // Construct the URL
    const redirectUrl = `http://localhost:3006/registered-beneficiaries?userIdType=${userIdType}&token=${generatedToken}`;

    // Send a GET request to the constructed URL
    try {
      // Redirect to the specified URL
      window.location.href = redirectUrl;

    } catch (error) {
      console.error('Error redirecting:', error);
    }
  };


  return (
    <div>
      <div style={{ margin: '1%' }}>
        <Header />
      
        <div className="w3-container w3-card-4">
          <h2>Token Registration</h2>
          <form className='w3-container w3-card w3-padding-16' onSubmit={handleSubmit}>
            <h4>Welcome <b>{userData ?userData.name:''}</b>, Please select the payment type and number</h4>
            <div className='w3-padding-16'>
              <label htmlFor="paymentType">Payment Type:</label>
              <select className='w3-input w3-border w3-round w3-animate-input' style={{width:'30%'}} id="paymentType" value={selectedPaymentType} onChange={(e) => setSelectedPaymentType(e.target.value)}>
                <option value="">Select Payment Type</option>
                {paymentTypes.map(paymentType => (
                  <option key={paymentType.type} value={paymentType.type}>{paymentType.type}</option>
                ))}
              </select>
            </div>
            <div className='w3-padding-16'>
              <label htmlFor="payeeId">Payment Number:</label>
              <input className='w3-input w3-border w3-round w3-animate-input' style={{width:'30%'}} type="text" id="payeeId" value={payeeId} onChange={(e) => setPayeeId(e.target.value)} />
            </div>
            <button className='w3-btn w3-blue w3-padding-16' type="submit" disabled={!selectedPaymentType || !payeeId || loading}>
              {loading ? 'Loading...' : 'Register Token'}
            </button>
          </form>
        </div>
        <div className="w3-container w3-card-4">
          {isLoading && (
            <div className="w3-panel w3-yellow">
              <h3>Loading...</h3>
            </div>
          )}
           {isMatch === true && (
                
                <div className="w3-panel w3-green">
                  <h3>Success!</h3>
                  <p>KYC Data Matches</p>
                </div>

              )}
              {isMatch === false && (
              
                <div className="w3-panel w3-red">
                  <h3>Failure!</h3>
                  <p>KYC Data Doesn't Match, Check the information submited</p>
                </div>
                
              )}
              {isMatch === null && (
                <div className="w3-panel w3-yellow">
                  <h3>Waiting...</h3>
                  <p>Fill in the form and submit</p>
                </div>
              )}
          {isGenerated !== null && (
            <div className={`w3-panel ${isGenerated ? 'w3-green' : 'w3-red'}`}>
              <h3>{isGenerated ? 'Success!' : 'Failure!'}</h3>
              <p>{isGenerated ? 'Token Generated' : 'Token Not Generated'}</p>
            </div>
          )}
          {isRegistered !== null && (
            <div className={`w3-panel ${isRegistered ? 'w3-green' : 'w3-red'}`}>
              <h3>{isRegistered ? 'Success!' : 'Failure!'}</h3>
              <p>{isRegistered ? 'Token Registered' : 'Token Not Registered'}</p>
            </div>
          )}
          {accountPosted !== null && (
            <div className={`w3-panel ${accountPosted ? 'w3-green' : 'w3-red'}`}>
              <h3>{accountPosted ? 'Success!' : 'Failure!'}</h3>
              <p>{accountPosted ? 'Account posted' : 'Failed to post account'}</p>
            </div>
          )}
          {isGenerated && isRegistered && accountPosted && (
            <button className='w3-btn w3-blue w3-padding-16' onClick={handleRedirect}>
              Redirect
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRegistrationPage;