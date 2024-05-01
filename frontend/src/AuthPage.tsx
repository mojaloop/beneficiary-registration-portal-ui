import React, { useState, useEffect } from 'react';
import Header from './Header';

/**
 * AuthPage component - handles the redirect to the KYC Authorization page
 */
const AuthPage: React.FC = () => {
  // Initialize the component's state
  const [payeeId, setpayeeId] = useState<string>(''); // The payeeId of the user


  useEffect(() => {
    /**
     * Redirect the user to the KYC Authorization page on page load
     */
    const clientId = 'XaOVhjFTX_H8UiZf-O1TuV4ChixshdO8RqghtA_cRUM'; // The clientId of the Mojaloop client

    const urlParams = new URLSearchParams(window.location.search); // Get the URL parameters
    const payeeIdParam = urlParams.get('payeeId'); // Get the payeeId parameter

    if (payeeIdParam) {
      setpayeeId(payeeIdParam); // Set the component's state with the payeeId parameter
    }

    const redirectUrl = encodeURIComponent('http://localhost:3007'); // The redirect URL for the Authorization request
   // const url = `https://esignet.collab.mosip.net/authorize?client_id=${clientId}&redirect_uri=${redirectUrl}&scope=openid%20profile&response_type=code`; // The Authorization request URL
    const esigneturl = `https://esignet.collab.mosip.net/authorize?nonce=ere973eieljznge2311&state=eree2311&client_id=${clientId}&redirect_uri=${redirectUrl}&scope=openid%20profile&response_type=code&acr_values=mosip:idp:acr:generated-code%20mosip:idp:acr:biometrics%20mosip:idp:acr:static-code&claims_locales=en&display=page&state=consent&max_age=21&ui_locales=en`; // The Authorization request URL with additional parameters

    // Redirect the browser to the specified URL
    window.location.href = esigneturl;
  }, []);

  return (
    <div>
      <div style={{ margin: '1%' }}>
        <Header />
        <div className="w3-container w3-card-4 w3-panel w3-blue w3-center">
          <h2>Redirecting...</h2>
          <p>You will be redirected to the KYC authorization page.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
