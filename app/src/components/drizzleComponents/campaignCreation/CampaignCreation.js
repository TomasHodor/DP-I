import React from "react";
import {Button, Col, Container, Form} from "react-bootstrap";
import Web3 from "web3";
import CrowdfundingCampaign from "../../../contracts/CrowdfundingCampaign.json";

class CampaignCreation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            goal: '',
            description: ''
        };
    }

    async handleSubmit(e) {
        e.preventDefault();
        let campaignOwner = this.props.user_id;
        let campaignGoalValue = parseInt(this.state.goal) * 1000000;

        let web3 = new Web3("ws://localhost:7545")
        let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, this.state.address);
        let result = await web3Contract.deploy({
            data: CrowdfundingCampaign.bytecode,
            arguments: [this.state.name, campaignGoalValue, this.state.address]
        }).send({
            from: this.state.address,
            gas: 1600000,
            gasPrice: '20000000000'
        // }, function(error, transactionHash){
        //     console.log(error);
        //     console.log(transactionHash);
        // }).on('error', function(error){
        //     console.log(error);
        // }).on('transactionHash', function(transactionHash){
        //     console.log(transactionHash);
        // }).on('receipt', function(receipt){
        //     console.log(receipt); // contains the new contract address
        // }).on('confirmation', function(confirmationNumber, receipt){
        //     console.log(confirmationNumber);
        //     console.log(receipt);
        // }).then(function(newContractInstance){
        //     console.log(newContractInstance) // instance with the new contract address
        });
        fetch('http://localhost:5000/campaign', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                owner: campaignOwner,
                address: result.options.address,
                description: this.state.description
            })
        })
            .then(response => response.json().then(data => {
                this.setState({ campaign_id: data.campaign_id })
                this.props.handleClose();
            }))
    }

    render() {
        return (
            <Container>
                <h2>Create Campaign</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Control type="text" placeholder="Campaign Name" value={this.state.name}
                            onChange={(e) =>  this.setState({name: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Control type="text" placeholder="Address" value={this.state.address}
                            onChange={(e) =>  this.setState({address: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3 row" controlId="formBasicGoal">
                        <Col md={6}>
                            <Form.Control type="number" placeholder="Goal" value={this.state.goal}
                                onChange={(e) =>  this.setState({goal: e.target.value})}/>
                        </Col>
                        <Col md={4}>
                            <Form.Label className="pt-2">Gwei</Form.Label>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicGoal">
                        <Form.Control
                            as="textarea"
                            placeholder="Describe your campaign"
                            rows={6}
                            value={this.state.description}
                            onChange={(e) =>  this.setState({description: e.target.value})}
                        />
                    </Form.Group>
                    <div className="d-grid">
                        <Button variant="outline-dark" onClick={this.handleSubmit.bind(this)}>Create Campaign</Button>
                    </div>
                </Form>
            </Container>
        )
    }
}

export default CampaignCreation;

