import React from 'react';
import {DrizzleContext} from "@drizzle/react-plugin";
import ContributeCrowdfund from "../ContributeCrowdfund";
import {Drizzle} from "@drizzle/store";
import drizzleOptions from "../../drizzleOptions";
import {Button, Form, Modal} from "react-bootstrap";

const drizzle = new Drizzle(drizzleOptions);

class NewCampaignModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            campaignOwner: '',
            address: ''
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch('http://localhost:5000/campaign', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                owner: this.state.campaignOwner,
                address: this.state.address
            })
        })
            .then(response => response.json().then(data => {
                this.setState({campaign_id: data.campaign_id})
                this.handleClose();
            }))
    }
    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <DrizzleContext.Provider drizzle={drizzle}>
                    <DrizzleContext.Consumer>
                        {drizzleContext => {
                            const {drizzle, drizzleState, initialized} =  drizzleContext;

                            if (!initialized) {
                                return "Loading..."
                            }

                            return (
                                <ContributeCrowdfund drizzle={drizzle} drizzleState={drizzleState}/>
                            )
                        }}
                    </DrizzleContext.Consumer>
                </DrizzleContext.Provider>
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="text"
                            placeholder="Address"
                            value={this.state.address}
                            onChange={(e) =>  this.setState({address: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="number"
                            placeholder="Owner"
                            value={this.state.campaignOwner}
                            onChange={(e) =>  this.setState({campaignOwner: e.target.value})}/>
                    </Form.Group>
                    <div className="d-grid">
                        <Button as="input" type="submit" value="Create" variant="dark" size="lg"/>
                    </div>
                    <br/>
                </Form>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default NewCampaignModal;