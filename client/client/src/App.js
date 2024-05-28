import axios from 'axios'
import './App.css';
import React from 'react';
import CellOverview from './components/CellOverview';
import OrderSummary from './components/OrderSummary';
import History from './components/History';
import Header from './components/Header';
//import { Container } from '@mui/material';

function App() {
  const apiCall = () =>{
    axios.get('http://localhost:8000').then(()=> {
      console.log("API Call made")
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <Header />
        <OrderSummary />
        <CellOverview />
        <History />
        <button onClick={apiCall}>Make API Call</button>
      </header>
    </div>

    
  );
}

export default App;
