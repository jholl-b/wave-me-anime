import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Abi from './utils/WavePortal.json';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [animeWaved, setAnimeWaved] = useState(0);
  const [animeToSend, setAnimeToSend] = useState("");
  const contractAddress = "0xB2607CF94A02576013BeC407984B677b04aF99A3";
  const contractABI = Abi.abi;

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

      getAllWaves();
      getTotalWaves();

    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          console.log(wave);
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            anime: wave.anime
          });
        });
        console.log("-------------");
        console.log(wavesCleaned);

        if (wavesCleaned.length > 0) {
          setAllWaves(wavesCleaned);
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  const getTotalWaves = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        setAnimeWaved(count.toNumber());
        
      } else {
        console.log("Ethereum object doesn't exist!");
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

  const waveAnime = async (e) => {
    e.preventDefault();

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waveTxn = await wavePortalContract.wave(animeToSend, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        let count = await wavePortalContract.getTotalWaves();
        console.log(`Retrieved total wave count... ${count.toNumber()}`);
        setAnimeWaved(count.toNumber());
        
      } else {
        console.log("Ethereum object doesn1t exist!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  useEffect(() => {
    let wavePortalContract;
    
    const onNewWave = (from, timestamp, anime) => {
      console.log('NewWave', from, timestamp, anime);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          anime: anime
        }
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on('NewWave', onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave);
      }
    };
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

        {/* <button className="waveButton" onClick={wave}>
          Me conta ai
        </button> */}

        {currentAccount && (
          <form onSubmit={waveAnime}>
            <label>
              Anime: 
              <input 
                className="animeInput"
                type="text" 
                name="anime" 
                value={animeToSend}
                onChange={(e) => setAnimeToSend(e.target.value)} />
            </label>
            <input 
              type="submit" className="waveButton enviar" value="Enviar" />
          </form>
        )}

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Conectar Carteira
          </button>
        )}

        <div>
          <h5>Total de sugestões: {animeWaved}</h5>
        </div>

        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Anime: {wave.anime}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;
