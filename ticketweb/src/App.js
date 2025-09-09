import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header';
import Home from './components/Home';
import Categories from './components/Categories';
import Footer from './components/layout/Footer';

function App() {
  console.log("App component mounted");
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
