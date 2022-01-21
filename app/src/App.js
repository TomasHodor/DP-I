import React from "react";
import "./App.css";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Contribute from "./pages/Contribute";
import Registration from "./pages/Registration";


const App = () => {
  return (
      <div className="App">
          <Router>
              <Navbar />
              <Routes>
                  <Route path='/' exact element={<Home/>} />
                  <Route path='/Contribute' exact element={<Contribute/>} />
                  <Route path='/Registration' exact element={<Registration/>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
