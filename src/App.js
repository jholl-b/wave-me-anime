import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Abi from './utils/WavePortal.json';
import './App.css';

function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [animeToSend, setAnimeToSend] = useState("");
  const [animeWaved, setAnimeWaved] = useState(0);
  const [nameAnimeWaved, setNameAnimeWaved] = useState("");
  const contractAddress = "0x0D33F03F7Aab650F04383441F1ed8657adb42124";
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

  const getWavedAnime = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let anime = await wavePortalContract.getWavedAnime();
        setNameAnimeWaved(anime);
        
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

  // const wave = async () => {
  //   try {
  //     const { ethereum } = window;

  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  //       let count = await wavePortalContract.getTotalWaves();
  //       console.log(`Retrieved total wave count... ${count.toNumber()}`);

  //       const waveTxn = await wavePortalContract.waveAnime("One Piece");
  //       console.log("Mining...", waveTxn.hash);

  //       await waveTxn.wait();
  //       console.log("Mined -- ", waveTxn.hash);

  //       count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
        
  //     } else {
  //       console.log("Ethereum object doesn1t exist!");
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const waveAnime = async (e) => {

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waveTxn = await wavePortalContract.waveAnime(animeToSend);
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

    e.preventDefault();
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getTotalWaves();
    getWavedAnime();
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
          <h5>Você me sugeriu: {nameAnimeWaved}</h5>
          <h5>Total de sugestões: {animeWaved}</h5>
        </div>
      </div>
    </div>
  );
}

export default App;
