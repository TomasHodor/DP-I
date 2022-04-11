import React from "react";
import {Alert, Button, Col, Container, Form} from "react-bootstrap";
import web3 from "../../../web3Instance"
import CrowdfundingCampaign from "../../../contracts/CrowdfundingCampaign.json";
import ConfirmModal from "../../confirmModal/ConfirmModal";
import nodejs_connection from "../../../nodejsInstance"
import LoadingModal from "../../loadingModal/LoadingModal";

class CampaignCreation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            goal: '',
            description: '',
            error: '',
            etherValue: 'wei',
            confirmModal: false,
            loadingModal: false
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        if (typeof window.ethereum === 'undefined') {
            this.setState({ error: 'MetaMask is missing!' });
            return;
        }
        if (this.state.name === '') {
            this.setState({ error: 'Name of campaign is missing' });
            return;
        }
        if (this.state.goal === '') {
            this.setState({ error: 'Goal value for campaign is empty' });
            return;
        }
        this.setState({ error: '', confirmModal: true });
    }

    closeConfirmModal() {
        this.setState({ error: '', confirmModal: false });
    }

    async createCampaign() {
        this.setState({ loadingModal: true })
        let campaignOwner = this.props.user_id;

        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        if (accounts.length < 1) {
            this.setState({ error: 'No account selected'});
            return
        }
        const account = accounts[0];

        let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, account);
        let deployTx = await web3Contract.deploy({
            data: CrowdfundingCampaign.bytecode,
            arguments: [this.state.name, web3.utils.toWei(this.state.goal, this.state.etherValue), account]
        });
        const deployedContract = await deployTx
            .send({from: account, gas: await deployTx.estimateGas()})
            .on('error', function (error) {
                this.setState({ error: error.toString(), loadingModal: false });
            })
            .on("transactionHash", (txhash) => { console.log(txhash)});

        if (this.state.error === '' && "options" in deployedContract) {
            let postResponse = await fetch(nodejs_connection + '/campaign', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    owner: campaignOwner,
                    address: deployedContract.options.address,
                    description: this.state.description
                })
            });
            let jsonResponse = await postResponse.json();
            this.setState({ campaign_id: jsonResponse.campaign_id, loadingModal: false
            })
            this.props.handleClose();
        }
    }

    render() {
        const confirmModal = this.state.confirmModal ? (
            <ConfirmModal
                show={this.state.confirmModal}
                confirm={this.createCampaign.bind(this)}
                cancel={this.closeConfirmModal.bind(this)}
                text={"Do you want to create campaign " + this.state.name + " ?"}
            />
        ) : null;
        const loadingModal = this.state.loadingModal ? <LoadingModal show={this.state.loadingModal} /> : null;
        return (
            <Container>
                {confirmModal}
                {loadingModal}
                <h2>Create Campaign</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Control type="text" placeholder="Campaign Name" value={this.state.name}
                            onChange={(e) => this.setState({name: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3 row" controlId="formBasicGoal">
                        <Col md={6}>
                            <Form.Control type="number" placeholder="Goal" value={this.state.goal}
                                onChange={(e) => this.setState({goal: e.target.value})}/>
                        </Col>
                        <Col md={3}>
                            <Form.Select onChange={(e) => this.setState({etherValue: e.target.value})}>
                                <option value="wei">Wei</option>
                                <option value="gwei">Gwei</option>
                                <option value="ether">Ether</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicGoal">
                        <Form.Control as="textarea" placeholder="Describe your campaign" rows={6} value={this.state.description}
                            onChange={(e) => this.setState({description: e.target.value})}/>
                    </Form.Group>
                    <div className="d-grid mb-2">
                        <Button variant="outline-dark" onClick={this.handleSubmit.bind(this)}>Create Campaign</Button>
                    </div>
                    {this.state.error ? <Alert variant='danger'>{this.state.error}</Alert> : null}
                </Form>
            </Container>
        )
    }
}

export default CampaignCreation;

