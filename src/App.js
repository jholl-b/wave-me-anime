import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
  
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log(`Found an authorized account: ${account}`);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }

    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 

    } catch (error) {
      console.log(error);
    }
  }

  const wave = () => {

  }

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Me manda um anime. 📺
        </div>

        <div className="bio">
          <p>Olá, sou o Jholl.</p>
          <p>Tem algum anime legal? Me diz o nome. XD</p>
          <p>🚛 lhe levara para bons isekais.</p>
        </div>

        <button className="waveButton" onClick={wave}>
          Me conta ai
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar Carteira
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
