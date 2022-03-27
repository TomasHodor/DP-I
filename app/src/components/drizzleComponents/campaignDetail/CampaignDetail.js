import React from "react";
import {Alert, Badge, Button, Card, Col, Container, Form, ProgressBar, Table} from "react-bootstrap";
import web3 from "./../../../web3instance"
import CrowdfundingCampaign from "../../../contracts/CrowdfundingCampaign.json";
import ConfirmModal from "../../confirmModal/ConfirmModal";

class CampaignDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            confirmModal: false,
            confirmModalText: '',
            value: '',
            description: '',
            totalValue: 0,
            goalValue: 1000000,
            contributions: [],
            contributionsCheckBoxs: [],
            campaignStatus: null,
            campaignAddress: this.props.address,
            campaignOwnerAddress: null,
            campaignOwner: null,
            campaignOwnerMail: null,
            campaignId: null,
            campaignDescription: null,
            user: this.props.user,
            error: null,
            gas: null,
            finishButton: false,
            cancelButton: false,
            withdrawButton: false,
            contributeButton: false
        };
    }

    async getCampaignValue(valueType) {
        const crowdfundingCampaignMethods = this.props.drizzle.contracts[this.props.name].methods;
        let valueTypeFunc = await crowdfundingCampaignMethods[valueType].call();
        return await valueTypeFunc.call();
    }

    async getDataset(url) {

    }

    async componentDidMount() {
        if (!(this.props.name in this.props.drizzle.contracts)) {
            let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, this.props.address);
            let events = ["logContractBalance", "logContributeMoney", "logContributions2length"];
            this.props.drizzle.addContract({ contractName: this.props.name, web3Contract: web3Contract}, events);
        }

        let campaignStatus = await this.getCampaignValue("campaignStatus");
        let totalValue = await this.getCampaignValue("totalValue");
        let goalValue = await this.getCampaignValue("goalValue");
        let campaignOwnerAddress = await this.getCampaignValue("ownerAddress");
        this.setState({
            campaignStatus: campaignStatus,
            totalValue: parseInt(totalValue),
            goalValue: parseInt(goalValue),
            campaignOwnerAddress: campaignOwnerAddress
        })
        let campaignRawRespond = await fetch('http://localhost:5000/campaign/address=' + this.props.address, {
            method: 'GET', headers: {'Content-Type': 'application/json'}
        });
        let campaignRespond = await campaignRawRespond.json();
        if (campaignRespond) {
            this.setState({
                campaignOwner: campaignRespond[0].owner,
                campaignId: campaignRespond[0].campaign_id,
                campaignDescription: campaignRespond[0].description,
                campaignOwnerMail: campaignRespond[0].email
            })
        }

        if (this.state.user) {
            const crowdfundingCampaignMethods = this.props.drizzle.contracts[this.props.name].methods;
            if (this.state.user.user_id === this.state.campaignOwner) {
                let apiResponse = await fetch('http://localhost:5000/contribution/campaign=' + this.state.campaignId, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                let jsonResponse = await apiResponse.json();
                for (let i = 0; i < jsonResponse.length; i++) {
                    if (jsonResponse[i].hash) {
                        let trans = await web3.eth.getTransaction(jsonResponse[i].hash);
                        let valueTypeFunc = await crowdfundingCampaignMethods.contributions(i);
                        let contribution = await valueTypeFunc.call();
                        jsonResponse[i]["value"] = trans.value;
                        jsonResponse[i]["from"] = trans.from;
                        jsonResponse[i]["text"] = contribution.description;
                    }
                }
                this.setState({ contributions: jsonResponse })
            } else {

                let apiResponse = await fetch('http://localhost:5000/contribution/contributor=' + this.state.user.user_id
                    + "&campaign=" + this.state.campaignId, {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                });
                let jsonResponse = await apiResponse.json();
                for (let i = 0; i < jsonResponse.length; i++) {
                    if (jsonResponse[i].hash) {
                        let trans = await web3.eth.getTransaction(jsonResponse[i].hash);
                        let valueTypeFunc = await crowdfundingCampaignMethods.contributions2(trans.from, i);
                        let contribution = await valueTypeFunc.call();
                        console.log(contribution)
                        jsonResponse[i]["value"] = trans.value;
                        jsonResponse[i]["from"] = trans.from;
                        jsonResponse[i]["text"] = contribution.description;
                    }
                }
                this.setState({ contributions: jsonResponse })
            }
                await this.getDataset();
        }
    }

    contributeButton(e) {
        e.preventDefault();
        if (this.state.value === ""){
            this.setState({ error: "Empty value" })
            return;
        }
        if (typeof window.ethereum === 'undefined') {
            console.log('MetaMask is missing!');
            this.setState({ error: 'MetaMask is missing' })
            return;
        }
        this.setState({
            error: '',
            confirmModal: true,
            contributeButton: true,
            confirmModalText: "Do you want to contribute to this campaign ?"});
    }

    async contributeCampaign() {
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        console.log(accounts)
        if (accounts.length === 0) {
            this.setState({ error: 'No MetaMask accounts' })
            return
        }
        const account = accounts[0];
        let contribValue = parseInt(this.state.value) * 1000000;
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        let contributeFunction = await crowdfundingCampaign.methods.contributeCampaign(this.state.description);
        let contributeResult = await contributeFunction.call();
        if (contributeResult) {
            let contributeSendResult = await contributeFunction.send({
                value: contribValue, from: account, gas: 1000000
            })
            console.log(contributeSendResult);
            this.setState({ gas: contributeSendResult.gasUsed });
            let postResponse = await fetch('http://localhost:5000/contribution', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    campaign: this.state.campaignId,
                    contributor: this.state.user.user_id,
                    hash: contributeSendResult.transactionHash
                })
            });
            let jsonResponse = await postResponse.json();
            let contributions = this.state.contributions;
            contributions.push({
                contribution_id: jsonResponse.contribution_id,
                campaign: this.state.campaignId,
                contributor: this.state.user.user_id,
                hash: contributeSendResult.transactionHash,
                value: this.state.value,
                from: account
            })
            this.setState({
                contributions: contributions,
                value: '',
                description: '',
                totalValue: parseInt(this.state.totalValue) + contribValue
            })
        } else {
            this.setState({ error: "error" })
        }
    }

    finishCampaignButton(e) {
        e.preventDefault();
        if (this.state.totalValue < this.state.goalValue) {
            this.setState({error: "Can not finish this campaign. Not enough value was funded"})
            return;
        }
        this.setState({
            error: '',
            confirmModal: true,
            finishButton: true,
            confirmModalText: "Do you want to finish this campaign ?"});
    }

    async finishCampaign() {
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        let campaignOwnerBalanceBefore = await web3.eth.getBalance(this.state.campaignOwnerAddress);
        console.log(campaignOwnerBalanceBefore);
        let finishCampaign = await crowdfundingCampaign.methods.finishCampaign().send({
            gas: 1000000,
            from: this.state.campaignOwnerAddress
        });
        console.log(finishCampaign);

        let campaignOwnerBalanceAfter = await web3.eth.getBalance(this.state.campaignOwnerAddress);
        console.log(campaignOwnerBalanceAfter);
        console.log(parseInt(campaignOwnerBalanceAfter) - parseInt(campaignOwnerBalanceBefore));
        let campaignStatus = await this.getCampaignValue("campaignStatus");
        console.log("Status:", campaignStatus);
        let campaignAddressBalance = await web3.eth.getBalance(this.state.campaignAddress);
        console.log(campaignAddressBalance);
        this.setState({ campaignStatus: campaignStatus, finishButton: false });
    }

    cancelCampaignButton(e) {
        e.preventDefault();
        this.setState({error: '', confirmModal: true, cancelButton: true, confirmModalText: "Do you want to cancel this campaign ?"});
    }

    async cancelCampaign() {
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        let cancelCampaign = await crowdfundingCampaign.methods.cancelCampaign().send({
            gas: 1000000,
            from: this.state.campaignOwnerAddress
        });
        console.log(cancelCampaign);
        let campaignStatus = await this.getCampaignValue("campaignStatus");
        this.setState({ campaignStatus: campaignStatus,
            finishButton: false,
            cancelButton: false,
            withdrawButton: false,
            contributeButton: false
        });
    }

    async withdrawContribution(e) {
        e.preventDefault();
        let contributionsCheckBoxs = this.state.contributionsCheckBoxs;
        let contributions = this.state.contributions;
        console.log(contributionsCheckBoxs);
        contributionsCheckBoxs.forEach(element => {
            console.log(contributions[element]);
            contributions.splice(element, 1);
        })
        this.setState({ contributions: contributions, contributionsCheckBoxs: [] })
        // const crowdfundingCampaign = this.props.drizzle.contracts["CrowdfundingCampaign"];
        // let withdrawContributionFunc = await crowdfundingCampaign.methods.withdrawContribution.call();
        // let withdrawContributionResult = await withdrawContributionFunc.call();
        // console.log(withdrawContributionResult);
    }

    async openConfirmModal() {
        if (this.state.finishButton)
            await this.finishCampaign();
        if (this.state.cancelButton)
            await this.cancelCampaign();
        if (this.state.contributeButton)
            await this.contributeCampaign();
        if (this.state.withdrawButton)
            await this.withdrawContribution();
    }


    closeConfirmModal() {
        this.setState({confirmModal: false});
    }

    handleOnChange(i) {
        let contributionsCheckBoxs = this.state.contributionsCheckBoxs;
        if (contributionsCheckBoxs.includes(i)){
            contributionsCheckBoxs = contributionsCheckBoxs.filter((e) => {return e !== i });
        } else {
            contributionsCheckBoxs.push(i);
        }
        this.setState({ contributionsCheckBoxs: contributionsCheckBoxs.sort().reverse() });
    }

    showContributions() {
        let output = [];
        let dataset = this.state.contributions;
        for (let i = 0; i < dataset.length; i++) {
            let value = parseInt(dataset[i].value) >= 1000000000
                ? parseInt(dataset[i].value) / 1000000000 + " Gwei"
                : dataset[i].value
            if (this.state.user.user_id === this.state.campaignOwner) {
                output.push(
                    <tr key={'row-' + i} id={'row-' + i}>
                        <td>{ dataset[i].from }</td>
                        <td>{ dataset[i].text }</td>
                        <td>{ value }</td>
                    </tr>)
            } else {
                output.push(
                    <tr key={'row-' + i} id={'row-' + i}>
                        <td><Form.Check type={'checkbox'} id={'row-' + i}
                                        checked={this.state.contributionsCheckBoxs.includes(i)}
                                        onChange={() => this.handleOnChange(i)}/></td>
                        <td>{ dataset[i].from }</td>
                        <td>{ dataset[i].text }</td>
                        <td>{ value }</td>
                    </tr>)
            }
        }
        return output;
    }

    render() {
        const confirmModal = this.state.confirmModal ? (
            <ConfirmModal
                show={this.state.confirmModal}
                confirm={this.openConfirmModal.bind(this)}
                cancel={this.closeConfirmModal.bind(this)}
                text={this.state.confirmModalText}
            />
        ) : null;
        const contribute = this.state.campaignStatus && this.state.user && this.state.campaignOwner !== this.state.user.user_id ?
            <Form id="contribute" className="mt-3" onSubmit={this.contributeButton.bind(this)}>
                <Form.Group className="mb-3 row" controlId="formBasicValue">
                    <Col md={6}>
                        <Form.Control type="number" placeholder="Enter value in Gwei" value={this.state.value}
                            onChange={(e) => this.setState({value: e.target.value})}/>
                    </Col>
                    <Col md={4}>
                        <Form.Label className="pt-2">Gwei</Form.Label>
                    </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDetail">
                    <Form.Control type="text" placeholder="Enter description" value={this.state.description}
                        onChange={(e) => this.setState({description: e.target.value})}/>
                </Form.Group>
                <div className="d-grid">
                    <Button variant="dark" type="submit">Contribute</Button>
                </div>
            </Form> : null

        let progress = (this.state.totalValue / this.state.goalValue * 100).toFixed(2)
        const progressBar = this.state.totalValue < this.state.goalValue ?
            <ProgressBar variant="primary" className="mt-2" now={parseFloat(progress)} label={`${progress}%`} /> :
            <ProgressBar variant="success" className="mt-2" now={parseFloat(progress)} label={`${progress}%`} />;

        let campaignStatus = this.state.campaignStatus === "active" ? <Badge pill bg="primary">Active</Badge> :
            this.state.campaignStatus === "finished" ? <Badge pill bg="success">Successful</Badge> :
                <Badge pill bg="danger">Canceled</Badge>

        const ownerOperations = this.state.user && this.state.campaignOwner === this.state.user.user_id ?
            <>
                <Button variant="outline-dark" className="mt-3 me-3"
                        disabled={this.state.campaignStatus === "canceled" || this.state.campaignStatus === "finished"}
                        onClick={this.finishCampaignButton.bind(this)} >Finish Campaign</Button>
                <Button variant="dark" className="mt-3 me-3"
                        disabled={this.state.campaignStatus === "canceled" || this.state.campaignStatus === "finished"}
                        onClick={this.cancelCampaignButton.bind(this)}>Cancel Campaign</Button>
            </> : null

        const contributionsWallet = this.state.user && this.state.contributions.length && this.state.campaignStatus
            ? this.state.campaignOwner === this.state.user.user_id  ?
                <Table className="mt-2" striped bordered hover size="sm">
                    <thead><tr><th>address</th><th>text</th><th>value</th></tr></thead>
                    <tbody>{this.showContributions()}</tbody>
                </Table> :
            <Form id="withdraw" onSubmit={this.withdrawContribution.bind(this)}>
                <Table className="mt-2 mb-2" striped bordered hover size="sm">
                    <thead><tr><th/><th>address</th><th>text</th><th>value</th></tr></thead>
                    <tbody>{this.showContributions()}</tbody>
                </Table>
                <Button variant="outline-dark" type="submit">Withdraw Contribution</Button>
            </Form> : null

        return (
            <Container>
                {confirmModal}
                <p><strong>Address: </strong>{ this.state.campaignAddress }</p>
                <p><strong>Status: </strong>{ campaignStatus }</p>
                <p><strong>Owner: </strong>{ this.state.campaignOwnerMail }<br/>
                    {this.state.campaignOwnerAddress}</p>
                <p><strong>Total Value: </strong>{ this.state.totalValue / 1000000 } Gwei</p>
                <p><strong>Pledged Goal: </strong>{ this.state.goalValue / 1000000 } Gwei</p>
                <Card>
                    <Card.Body>
                        <Card.Title>Description</Card.Title>
                        <Card.Text>{ this.state.campaignDescription}</Card.Text>
                    </Card.Body>
                </Card>
                {progressBar}
                {contribute}
                {this.state.gas ? <Alert variant='primary' className="mt-2 mb-2">Used Gas: {this.state.gas}</Alert> : null}
                {ownerOperations}
                {contributionsWallet}
                <br/>
                {this.state.error ? <Alert variant='danger'>{this.state.error}</Alert> : null}
            </Container>
        )
    }
}

export default CampaignDetail;

