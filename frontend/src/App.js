import React from 'react'
import './App.css';
import {BrowserRouter as Router,Switch,Route} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <Router>
      <Header />
      <main className = 'py-3'>
        
        <h1>HelLo</h1>
        
      </main>
      <Footer />
    </Router>
  );
}

export default App;
