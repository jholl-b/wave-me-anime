import './App.css';

function App() {

  const wave = () => {

  }

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
      </div>
    </div>
  );
}

export default App;
