import React, { useState, useEffect , useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
//import Redis from 'ioredis';
//import {redisurl} from './lib/redis';


const KYCPage: React.FC = () => {
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const navigate = useNavigate();

  interface PaymentType {
    type: string;
    name: string;
}

 
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
    accessToken: string;
    idToken: string;
    tokenType: string;
    expiresIn: number;
    scope: string;
    sub: string;
    name: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    address: string;
    // address: {
    //   streetAddress: string;
    //   city: string;
    //   state: string;
    //   postalCode: string;
    //   country: string;
    // };
    kycStatus: string;
    passportNumber: string;
    kycData: {
      idType: string;
      idNumber: string;
      idExpiration: string;
    };
  
    constructor(data: any) {
      this.accessToken = data.access_token;
      this.idToken = data.id_token;
      this.tokenType = data.token_type;
      this.expiresIn = data.expires_in;
      this.scope = data.scope;
      this.sub = data.user_info.sub;
      this.name = data.user_info.name;
      this.email = data.user_info.email;
      this.phoneNumber = data.user_info.phone_number;
      this.dateOfBirth = data.user_info.date_of_birth;
      this.address = data.user_info.address;
      this.passportNumber = data.user_info.passportNumber;
    //     this.address = {
    //     streetAddress: data.user_info.address.street_address,
    //     city: data.user_info.address.city,
    //     state: data.user_info.address.state,
    //     postalCode: data.user_info.address.postal_code,
    //     country: data.user_info.address.country
    //   };
      this.kycStatus = data.user_info.kyc_status;
      this.kycData = {
        idType: data.user_info.kyc_data.id_type,
        idNumber: data.user_info.kyc_data.id_number,
        idExpiration: data.user_info.kyc_data.id_expiration
      };
    }
  }
  
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
    //   "address": {
    //     "street_address": "123 Main Street, Anytown, USA",
    //     "city": "Anytown",
    //     "state": "CA",
    //     "postal_code": "12345",
    //     "country": "USA"
    //   },
      "kyc_status": "verified",
      "kyc_data": {
        "id_type": "passport",
        "id_number": "ABC123456",
        "id_expiration": "2025-12-31"
      }
    }
  };
  
  const kycInfo = new KYCInformation(responseData);
  console.log(kycInfo);
  
   // Comparison logic goes here
   const compareKYCData = useCallback(async(kycInfo: KYCInformation, kycData: KYCData) => {
    // Initialize a variable to store whether KYC data matches
    let match = true;
  
    // Compare relevant fields
    if (kycInfo.name !== kycData.name) {
      match = false;
      console.log('Name does not match');
    }
    if (kycInfo.dateOfBirth !== kycData.dob) {
      match = false;
      console.log('Date of Birth does not match');
    }
    if (kycInfo.email !== kycData.email) {
      match = false;
      console.log('Email does not match');
    }
    if (kycInfo.phoneNumber !== kycData.phone) {
      match = false;
      console.log('Phone Number does not match');
    }
    if (
      kycInfo.address !== kycData.address 
    //   kycInfo.address.streetAddress !== kycData.address ||
    //   kycInfo.address.city !== kycData.address ||
    //   kycInfo.address.state !== kycData.address ||
    //   kycInfo.address.postalCode !== kycData.address ||
    //   kycInfo.address.country !== kycData.address
    ) {
      match = false;
      console.log('Address does not match');
    }
    if (
      kycInfo.passportNumber !== kycData.passport_number
    //   kycInfo.kycData.idType !== 'passport' ||
    //   kycInfo.kycData.idNumber !== kycData.passport_number ||
    //   kycInfo.kycData.idExpiration !== kycData.expiry_date
    ) {
      match = false;
      console.log('KYC Data does not match');
    }
  
    // Log the result of comparison
    if (match) {
      console.log('KYC Data Matches');
      setIsMatch(true);
      //await storeKYCInformationInRedis(kycInfo);
    } else {
      console.log('KYC Data Does Not Match');
      setIsMatch(false);
    }
  }, []);
  

  useEffect(() => {
    //get parties

  /**
   * Fetches KYC information from the switch for the given MSISDN
   */
  const handleGetParties = async () => {
    try {
      // URL for fetching KYC information from the switch
      const apiUrl = `http://192.168.1.55:3001/parties/MSISDN/tE0F0cbxGJ`;
      const response = await fetch(apiUrl);

      // Check if the response was successful
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      // Deserialize the response data
      const { kycInformation }: ResponseData = await response.json();

      // Parse the serialized KYC data
      const kycData: KYCData = JSON.parse(kycInformation).data;

      // Log the serialized KYC data received from the switch
      console.log('Serialized KYC data:', kycData);

      // Compare KYC data after fetching
      compareKYCData(kycInfo, kycData);
    } catch (error) {
      // Log an error if an exception occurs while fetching KYC information
      console.error('An error occurred while fetching party details:', error);

      // Display an alert to the user if an error occurs
      alert('Failed to fetch party details. Please try again later.');
    }
  };

    // Call the function to fetch KYC information when the component mounts
    handleGetParties();
  }, []);
/*
const storeKYCInformationInRedis = async (kycInfo: KYCInformation) => {
    try {
      const kycKey = `kyc:${kycInfo.sub}`;
      await redisurl.hmset(kycKey, {
        accessToken: kycInfo.accessToken,
        idToken: kycInfo.idToken,
        tokenType: kycInfo.tokenType,
        expiresIn: kycInfo.expiresIn.toString(),
        scope: kycInfo.scope,
        sub: kycInfo.sub,
        name: kycInfo.name,
        email: kycInfo.email,
        phoneNumber: kycInfo.phoneNumber,
        dateOfBirth: kycInfo.dateOfBirth,
        streetAddress: kycInfo.address,
        city: kycInfo.address,
        state: kycInfo.address,
        postalCode: kycInfo.address,
        country: kycInfo.address,
        kycStatus: kycInfo.kycStatus,
        idType: kycInfo.kycData.idType,
        idNumber: kycInfo.kycData.idNumber,
        idExpiration: kycInfo.kycData.idExpiration,
      });
      console.log('KYC information stored in Redis');
    } catch (error) {
      console.error('Error storing KYC information in Redis:', error);
    }
  };
  */
  return (
        <div>
          <div style={{ margin: '1%' }}>
            <Header />
            <div className="w3-container w3-card-4">
              <h2>Comparison Page</h2>
              {isMatch === true && (
                <div>
                <div className="w3-panel w3-green">
                  <h3>Success!</h3>
                  <p>KYC Data Matches</p>
                </div>

                <div className="w3-panel">            
                <button onClick={() => navigate('/register-token?id_token='+kycInfo.idToken)} className="w3-button w3-blue">Go to Register Token Page</button>
                </div>
                </div>

              )}
              {isMatch === false && (
                <div>
                <div className="w3-panel w3-red">
                  <h3>Failure!</h3>
                  <p>KYC Data Doesn't Match, Register User in Mosip and Mojaloop</p>
                </div>
                <div className="w3-panel">            
                <button onClick={() => window.location.href = 'http://localhost:3006'} className="w3-button w3-blue">Return</button>                </div>
                </div>
              )}
              {isMatch === null && (
                <div className="w3-panel w3-yellow">
                  <h3>Loading...</h3>
                  <p>Fetching KYC Information</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };
    

export default KYCPage;
