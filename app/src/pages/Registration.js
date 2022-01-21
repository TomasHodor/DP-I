import React from 'react';

class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handlePassword2Change(event) {
        this.setState({password2: event.target.value});
    }

    render() {
        return (
            <>
                Registration
                <label>E-mail</label>
                <input type="text" value={this.state.email} onChange={this.handleEmailChange} />
                <label>Password</label>
                <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
                <label>Password confirmation</label>
                <input type="text" value={this.state.password2} onChange={this.handlePassword2Change} />
            </>
        );
    }
}
export default Registration;