import React from 'react';
import logo from './logo.svg';
import './App.css';

const link = "https://api.wheretheiss.at/v1/satellites/25544";


async function getISSLocation(){
  let r = await (await fetch(link)).json();

  console.log(r);
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={getISSLocation}>Update!</button>

      </header>
    </div>
  );
}

export default App;
