import './App.css';
import SecretLogo from './secret-logo.png';
import TwitterXLogo from './twitterx.png';
import GihubLogo from './github.png';
import SensiShareLogo from './sensishare.jpg';
import React, { useState, useEffect } from "react";
import { initializeWeb3Modal } from './config/web3ModalConfig';
import { useInitEthereum } from "./functions/initEthereum";
import Encrypt from './components/Encrypt';
import QueryValue from './components/Query';
import ListAll from './components/ListAll';

function App() {
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    initializeWeb3Modal();
  }, []);

  useInitEthereum(setChainId);

  return (
    <>
      <div className="min-h-screen text-brand-orange px-6 lg:px-8">
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <img src={SensiShareLogo} alt="SensiShareLogo" className="h-10" />
          </div>
          <h1 className="flex-2 text-center text-xl font-bold">SensiShare</h1>
          <div className="flex-1 flex justify-end">
            <w3m-button className="connect-wallet-button" themeMode="dark" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-xl font-bold mt-4">Time based wallet-bound secret sharing and revoking</p>
          <ListAll />
          <Encrypt />

        </div>
        <div className="fixed bottom-0 left-0 right-0 flex flex-row justify-around items-center bg-blue-500">
          <a className="transform scale-50" href="https://scrt.network/" target="_blank" rel="noopener noreferrer">
            <img src={SecretLogo} alt="Secret Logo" className="w-18 h-12 mt-4" />
          </a>

          <a className="transform scale-50" href="https://www.x.com/armsves/" target="_blank" rel="noopener noreferrer">
            <img src={TwitterXLogo} alt="TwitterX Logo" className="w-18 h-12 mt-4" />
          </a>

          <a className="transform scale-50" href="https://scrt.network/" target="_blank" rel="noopener noreferrer">
            <img src={GihubLogo} alt="GithubLogo" className="w-18 h-12 mt-4" />
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
