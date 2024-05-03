import React, { useState } from 'react';
import Header from './Header';
//require('dotenv').config();

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

const TokenRegistrationPage: React.FC = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenData, setTokenData] = useState<any | null>(null);

  const postDataAndReturnToken = async (requestData: any) => {
    try {
      const apiUrl = process.env.API_URL

      if (!apiUrl) {
        console.error('One or more required environment variables are not defined');        
      }
     
      const response = await fetch(`http://localhost:8080/getUserInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData)
  });

  if (!response.ok || response.status === 400 || response.status === 500) {
    setLoading(false);
    console.error(` due to ${response.status} ${response.statusText}`);
  }

  const data = await response.json();


  const tokenData = data;
  return tokenData;
} catch (error) {
  console.error('An error occurred while fetching token data:', error);
  return { error: error };
}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentType || !payeeId || loading) return;

    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams(window.location.search);
      const nonce = searchParams.get('nonce');
      const state = searchParams.get('state');
      const code = searchParams.get('code');
      if (code == null && nonce == null && state == null) {
        setError("Code in undefined");
        return
      }
      try {
        const requestData = { code, selectedPaymentType, payeeId };
        const result = await postDataAndReturnToken(requestData);
        if (result.error) {
          setError(result.error);
        } else {
          setTokenData(result);
        }
      } catch (error: any) {
        setError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
      

  const handleRedirect = async () => {
    // Assuming tokenData contains the required information for redirection
    const name = tokenData.name;
    const generatedToken = tokenData.tokenData.token; // Replace 'token' with the actual generated token

    const redirectUrl = `http://localhost:3006/registered-beneficiaries?name=${name}&token=${generatedToken}`;

    try {
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
            <h4>Please select the payment type and number</h4>
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
            {error && <div className="w3-panel w3-red"><h3>Error!</h3><p>{error}</p></div>}
          </form>
        </div>
        {tokenData && (
          <div className="w3-container w3-card-4">
            <div className="w3-panel w3-green">
              <h3>Success!</h3>
             
            </div>
            <div className="w3-panel"> <p>
  Token Data: <br />
  {Object.entries(tokenData).map(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key}>
          {key}: <br />
          {Object.entries(value).map(([innerKey, innerValue]) => (
            <div key={innerKey}>
              {innerKey}: {JSON.stringify(innerValue)}
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div key={key}>
          {key}: {JSON.stringify(value)}
        </div>
      );
    }
  })}
</p>

              <button className='w3-btn w3-blue w3-padding-16' onClick={handleRedirect}>
                Redirect
              </button></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokenRegistrationPage;
