import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import {Container, Form} from "react-bootstrap";

const { ContractData, ContractForm } = newContextComponents;

class ContributeCrowdfund extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            address: ''
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    handleValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleAddressChange(event) {
        this.setState({address: event.target.value});
    }

    render() {
        return (
            <Container className="section">
                <h2>Contribute to Crowdfund</h2>
                <p>
                    <strong>Owner: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaign"
                        method="ownerAddress"
                    />
                </p>
                <p>
                    <strong>Total Value: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaign"
                        method="totalValue"
                    />
                </p>
                <p>
                    <strong>Pledged Goal: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaign"
                        method="goalValue"
                    />
                </p>
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="number" placeholder="Enter value in Wei" value={this.state.value} onChange={this.handleValueChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="text" placeholder="Enter address" value={this.state.address} onChange={this.handleAddressChange}/>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center mb-4" controlId="creator">
                        <ContractForm
                            drizzle={this.props.drizzle}
                            contract="CrowdfundingCampaign"
                            method="contributeCampaign"
                            sendArgs={{ value: this.state.value, from: this.state.address }} />
                    </Form.Group>
                </Form>
                <ContractForm
                    drizzle={this.props.drizzle}
                    contract="CrowdfundingCampaign"
                    method="contribute"
                    sendArgs={{ value: this.state.value, from: this.state.address }} />
            </Container>
        )
    }
}

export default ContributeCrowdfund;

