import React, { useState, useEffect } from 'react';
import Header from './Header';
import { registerAccount, registerToken } from './TokenService';

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

const RegisterTokenPage: React.FC = () => {
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [payeeId, setPayeeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
  const [isGenerated, setIsGenerated] = useState<boolean | null>(null);
  
  const [accountPosted, setAccountPosted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const [idToken, setIdToken] = useState<string>('');


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const idTokenParam = urlParams.get('id_token');
    if (idTokenParam) {
      setIdToken(idTokenParam);
    }
  }, []);

  console.log('idToken-regi:', idToken);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsLoading(true);
    const token = await registerToken(selectedPaymentType, payeeId, idToken);
    setLoading(false);
    setIsLoading(false);
    if (token) {
      setIsRegistered(true);
      setIsGenerated(true);
    } else {
      setIsRegistered(false);
      setIsGenerated(false);
      alert('An error occurred while registering the token');
    }

    const account = await registerAccount(selectedPaymentType, payeeId);
    setLoading(false);
    setIsLoading(false);
    if (token) {
      setAccountPosted(true);
    } else {
      setAccountPosted(false);
      alert('An error occurred while posting account details');
    }
  };

  const handleRedirect = async () => {
    // Assuming userIdType and generatedToken are available
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

export default RegisterTokenPage;