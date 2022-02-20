import React from "react";
import "./App.css";
import NavBarTop from "./components/navbar/NavBarTop";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Contribute from "./pages/Contribute";
import Registration from "./pages/Registration";
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
      <div className="App">
          <NavBarTop />
          <Router>
              <Routes>
                  <Route path='/' exact element={<Home/>} />
                  <Route path='/contribute' exact element={<Contribute/>} />
                  <Route path='/registration' exact element={<Registration/>} />
              </Routes>
          </Router>
      </div>
  );
}

export default App;
