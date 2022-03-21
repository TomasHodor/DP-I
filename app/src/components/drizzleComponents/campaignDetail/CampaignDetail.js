import React from "react";
import {Alert, Badge, Button, Col, Container, Form, ProgressBar, Table} from "react-bootstrap";
import Web3 from "web3";
import CrowdfundingCampaign from "../../../contracts/CrowdfundingCampaign.json";

let web3 = new Web3("ws://localhost:7545");

class CampaignDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            addressFrom: '',
            description: '',
            totalValue: 0,
            goalValue: 100,
            contributions: [],
            campaignStatus: null,
            campaignAddress: null,
            campaignOwnerAddress: null,
            campaignOwner: null,
            campaignOwnerMail: null,
            campaignId: null,
            campaignDescription: null,
            user: null,
            error: null,
            gas: null
        };
        this.contributeCampaign = this.contributeCampaign.bind(this);
    }

    async getCampaignValue(valueType) {
        const crowdfundingCampaignMethods = this.props.drizzle.contracts[this.props.name].methods;
        let valueTypeFunc = await crowdfundingCampaignMethods[valueType].call();
        return await valueTypeFunc.call();
    }

    async getDataset(url) {
        let apiResponse = await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });
        let jsonResponse = await apiResponse.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            let trans = await web3.eth.getTransaction(jsonResponse[i].hash);
            jsonResponse[i]["value"] = trans.value;
            jsonResponse[i]["from"] = trans.from;
        }
        this.setState({
            contributions: jsonResponse
        })
    }

    async componentDidMount() {
        if (!(this.props.name in this.props.drizzle.contracts)) {
            let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, this.props.address);
            let events = ["logContractBalance", "logContributeMoney"]
            this.props.drizzle.addContract({ contractName: this.props.name, web3Contract: web3Contract}, events);
        }

        let campaignStatus = await this.getCampaignValue("campaignStatus");
        let totalValue = await this.getCampaignValue("totalValue");
        let goalValue = await this.getCampaignValue("goalValue");
        let campaignOwnerAddress = await this.getCampaignValue("ownerAddress");
        //let campaignOwnerContributions = await this.getCampaignValue("contributions");
        //let campaignOwnerContributions2 = await this.getCampaignValue("contributions2");
        //console.log(this.props.drizzle.contracts[this.props.name].methods)
        //let valueTypeFunc = await this.props.drizzle.contracts[this.props.name].methods.contributions(0).send({from: "0x86EE0315740864314e19cea61B85c9e0B860BB96"});
        //console.log(await valueTypeFunc.call(0));
        //console.log(campaignOwnerContributions);
        //console.log(campaignOwnerContributions2);

        this.setState({
            campaignStatus: campaignStatus,
            totalValue: totalValue,
            goalValue: goalValue,
            campaignOwnerAddress: campaignOwnerAddress,
            user: this.props.user,
            campaignAddress: this.props.address
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
            this.state.user.user_id === this.state.campaignOwner ?
                await this.getDataset('http://localhost:5000/contribution/campaign=' + this.state.campaignId) :
                await this.getDataset('http://localhost:5000/contribution/contributor=' + this.state.user.user_id
                    + "&campaign=" + this.state.campaignId);
        }
    }

    async contributeCampaign(e) {
        e.preventDefault();
        if (this.state.value === ""){
            this.setState({ error: "Empty value" })
            return;
        }
        let contribValue = parseInt(this.state.value) * 1000000;
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        let contributeFunction = await crowdfundingCampaign.methods.contributeCampaign(this.state.description).send({
            value: contribValue,
            from: this.state.addressFrom,
            gas: 1000000
        })
        console.log(contributeFunction);
        this.setState({ gas: contributeFunction.gasUsed });
        fetch('http://localhost:5000/contribution', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                campaign: this.state.campaignId,
                contributor: this.state.user.user_id,
                hash: contributeFunction.transactionHash
            })
        }).then(response => response.json().then(async data => {
            let contribs = this.state.contributions;
            let totalValue = parseInt(this.state.totalValue) + contribValue;
            contribs.push({
                contribution_id: data.contribution_id,
                campaign: this.state.campaignId,
                contributor: this.state.user.user_id,
                hash: contributeFunction.transactionHash,
                from: contributeFunction.from,
                value: this.state.value
            })
            this.setState({
                contributions: contribs,
                totalValue: totalValue
            })
        }))
    }

    async finishCampaign(e) {
        e.preventDefault();
        if (this.state.totalValue < this.state.goalValue) {
            this.setState({ error: "Can not finish this campaign. Not enough value was funded" })
            return;
        }
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        let campaignOwnerBalanceBefore = await web3.eth.getBalance(this.state.campaignOwnerAddress);
        console.log(campaignOwnerBalanceBefore);
        let finishCampaign = await crowdfundingCampaign.methods.finishCampaign().send({
            gas: 1000000,
            from: this.state.campaignOwnerAddress
        });
        console.log(finishCampaign);
        // let finishCampaignFunc = await crowdfundingCampaign.methods.finishCampaign();
        // console.log(finishCampaignFunc);

        let campaignOwnerBalanceAfter = await web3.eth.getBalance(this.state.campaignOwnerAddress);
        console.log(campaignOwnerBalanceAfter);
        console.log(parseInt(campaignOwnerBalanceAfter) - parseInt(campaignOwnerBalanceBefore));
        let campaignStatus = await this.getCampaignValue("campaignStatus");
        console.log("Status:", campaignStatus);
        let campaignAddressBalance = await web3.eth.getBalance(this.state.campaignAddress);
        console.log(campaignAddressBalance);
        this.setState({ campaignStatus: campaignStatus });
    }

    async activateCampaign(e) {
        e.preventDefault();
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        console.log(this.props.drizzle.contracts[this.props.name].methods);

        let activateCampaignFunc = await crowdfundingCampaign.methods.activateCampaign.call();
        let activateCampaignResult = await activateCampaignFunc.call();
        console.log(activateCampaignResult);
        let campaignStatus = await this.getCampaignValue("campaignStatus");
        console.log("Status:", campaignStatus);
    }

    async cancelCampaign(e) {
        e.preventDefault();
        const crowdfundingCampaign = this.props.drizzle.contracts[this.props.name];
        // let result = await crowdfundingCampaign.methods.cancelCampaign.call();
        // let result2 = await result.call();
        let result = await crowdfundingCampaign.methods.getNumberOfContributions.call();
        let result2 = await result.call();
        console.log(result2);
    }

    async withdrawContribution(e) {
        e.preventDefault();
        // const crowdfundingCampaign = this.props.drizzle.contracts["CrowdfundingCampaign"];
        // let withdrawContributionFunc = await crowdfundingCampaign.methods.withdrawContribution.call();
        // let withdrawContributionResult = await withdrawContributionFunc.call();
        // console.log(withdrawContributionResult);
    }

    showContributions() {
        let output = [];
        let dataset = this.state.contributions;
        for (let i = 0; i < dataset.length; i++) {
            if (this.state.user.user_id === this.state.campaignOwner) {
                output.push(
                    <tr key={'row-' + i} id={'row-' + i}>
                        <td>{ dataset[i].from }</td>
                        <td>{ dataset[i].value }</td>
                    </tr>
                )
            } else {
                output.push(
                    <tr key={'row-' + i} id={'row-' + i}>
                        <td><Form.Check type={"radio"} id={'row-' + i}/></td>
                        <td>{ dataset[i].from }</td>
                        <td>{ dataset[i].value }</td>
                    </tr>
                )
            }
        }
        return output;
    }

    render() {
        const contribute = this.state.campaignStatus && this.state.user && this.state.campaignOwner !== this.state.user.user_id ?
            <Form id="contribute" className="mt-3" onSubmit={this.contributeCampaign}>
                <Form.Group className="mb-3 row" controlId="formBasicValue">
                    <Col md={6}>
                        <Form.Control type="number" placeholder="Enter value in Gwei" value={this.state.value}
                            onChange={(e) => this.setState({value: e.target.value})}/>
                    </Col>
                    <Col md={4}>
                        <Form.Label className="pt-2">Gwei</Form.Label>
                    </Col>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Control type="text" placeholder="Enter address" value={this.state.addressFrom}
                        onChange={(e) => this.setState({addressFrom: e.target.value})}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicDetail">
                    <Form.Control type="text" placeholder="Enter description" value={this.state.description}
                        onChange={(e) => this.setState({description: e.target.value})}/>
                </Form.Group>
                <div className="d-grid">
                    <Button variant="dark" type="submit">
                        Contribute
                    </Button>
                </div>
            </Form> : null

        let progress = (this.state.totalValue / this.state.goalValue * 100).toFixed(2)
        const progressBar = this.state.totalValue < this.state.goalValue ?
            <ProgressBar variant="primary" now={parseFloat(progress)} label={`${progress}%`} /> :
            <ProgressBar variant="success" now={parseFloat(progress)} label={`${progress}%`} />;


        let campaignStatus = this.state.campaignStatus ? <Badge pill bg="primary">Active</Badge>:
            this.state.totalValue >= this.state.goalValue ?
                <Badge pill bg="success">Successful</Badge> :
                <Badge pill bg="danger">Canceled</Badge>

        const ownerOperations = this.state.user && this.state.campaignOwner === this.state.user.user_id ?
            <><Button variant="outline-dark" disabled={!this.state.campaignStatus}
                      onClick={this.finishCampaign.bind(this)} >Finish Campaign</Button>
                <Button variant="dark" disabled={!this.state.campaignStatus}
                        onClick={this.cancelCampaign.bind(this)}>Cancel Campaign</Button>
                <Button variant="dark" disabled={this.state.campaignStatus}
                        onClick={this.activateCampaign.bind(this)}>Activate Campaign</Button></> : null

        const contributionsWallet = this.state.user && this.state.contributions.length && this.state.campaignStatus ? this.state.campaignOwner === this.state.user.user_id  ?
            <div className="mt-2">
                <Table striped bordered hover size="sm">
                    <thead><tr><th>address</th><th>value</th></tr></thead>
                    <tbody>{this.showContributions()}</tbody>
                </Table>
            </div>:
            <div className="mt-2">
                <Table striped bordered hover size="sm">
                    <thead><tr><th/><th>address</th><th>value</th></tr></thead>
                    <tbody>{this.showContributions()}</tbody>
                </Table>
                <Button variant="outline-dark" className="mt-2"
                        onClick={this.withdrawContribution.bind(this)}>Withdraw Contribution</Button>
            </div> : null

        return (
            <Container>
                <p><strong>Address: </strong>{ this.state.campaignAddress }</p>
                <p><strong>Status: </strong>{ campaignStatus }</p>
                <p><strong>Owner: </strong>{ this.state.campaignOwnerMail }<br/>
                    {this.state.campaignOwnerAddress}</p>
                <p><strong>Total Value: </strong>{ this.state.totalValue / 1000000 } Gwei</p>
                <p><strong>Pledged Goal: </strong>{ this.state.goalValue / 1000000 } Gwei</p>
                <p><strong>Description: </strong>{ this.state.campaignDescription }</p>
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

