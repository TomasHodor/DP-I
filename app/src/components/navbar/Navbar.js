import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
} from './NavBarElements';

class Navbar extends React.Component {

    render() {
        return (
            <>
                <Nav>
                    <Bars />
                    <NavMenu>
                        <NavLink to='/'>
                            Home
                        </NavLink>
                        <NavLink to='/Contribute'>
                            Contribute
                        </NavLink>
                        <NavLink to='/registration'>
                            Sign Up
                        </NavLink>
                    </NavMenu>
                    <NavBtn>
                        <NavBtnLink to='/signin'>Sign In</NavBtnLink>
                    </NavBtn>
                </Nav>
            </>
        );
    }
}

export default Navbar;