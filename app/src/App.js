import React from "react";
import "./App.css";
import NavBarTop from "./components/navbar/NavBarTop";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns/Campaigns";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import User from "./pages/User/User";

import 'bootstrap/dist/css/bootstrap.min.css';
import { DrizzleContext } from "@drizzle/react-plugin";
import { Drizzle } from "@drizzle/store";

import drizzleOptions from "./drizzleOptions";

const drizzle = new Drizzle(drizzleOptions);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    login(user) {
        const loggedUser = user !== undefined ? user : null;
        this.setState({user: loggedUser});
    }

    logout() {
        this.setState({user: null});
    }

    render() {
        return(
            <div className="App">
                <DrizzleContext.Provider drizzle={drizzle}>
                <Router>
                    <NavBarTop user={this.state.user} handleLogout={this.logout.bind(this)}/>
                    <Routes>
                        <Route path='/' element={<Home/>} />
                        <Route path='/campaigns' element={
                            <Campaigns user={this.state.user}/>}
                        />
                        <Route path='/registration' element={
                            <Registration handleLogin={this.login.bind(this)}/>}
                        />
                        <Route path='/login' element={
                            <Login handleLogin={this.login.bind(this)} />}
                        />
                        <Route path='/user' element={
                            <User user={this.state.user}/>}
                        />
                    </Routes>
                </Router>
                </DrizzleContext.Provider>
            </div>
        );
    }
}

export default App;
