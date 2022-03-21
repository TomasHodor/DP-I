import React from 'react';
import CampaignDetailModal from "../../components/campaignDetail/CampaignDetailModal";
import NewCampaignModal from "../../components/newCampaign/NewCampaignModal";
import {Badge, Button, Container, Table} from "react-bootstrap";

import "./Campaigns.css"
import Web3 from "web3";
import CrowdfundingCampaign from "../../contracts/CrowdfundingCampaign.json";

class Campaigns extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            campaignModal: false,
            campaignAddress: null,
            campaignName: null,
            newCampaignModal: false,
            user: null,
            dataset: []
        }
    }

    componentDidMount() {
        this.getAllCampaigns();
        if (this.props.user && 'user_id' in this.props.user) {
            this.setState({ user: this.props.user })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user) {
            this.setState({ user: this.props.user })
        }
    }

    showCampaignModal(address, name) {
        const campaignAddress = address !== undefined ? address : null;
        const campaignName = name !== undefined ? name : null;
        if (this.state.campaignModal){
            this.getAllCampaigns();
        }
        this.setState({
            campaignAddress: campaignAddress,
            campaignName: campaignName,
            campaignModal: !this.state.campaignModal,
        });

    }

    showNewCampaignModal() {
        if (this.state.newCampaignModal){
            this.getAllCampaigns();
        }
        this.setState({ newCampaignModal: !this.state.newCampaignModal });
    }

    getAllCampaigns() {
        fetch( 'http://127.0.0.1:5000/campaign', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json().then(async data => {
            let web3 = new Web3("ws://localhost:7545")
            for (let i = 0; i < data.length; i++) {
                let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, data[i].address);
                let nameFunc = await web3Contract.methods.campaignName.call();
                data[i].name = await nameFunc.call();
                let statusFunc = await web3Contract.methods.campaignStatus.call();
                data[i].status = await statusFunc.call();
                let goalValueFunc = await web3Contract.methods.goalValue.call();
                data[i].goalValue = await goalValueFunc.call();
                let totalValueFunc = await web3Contract.methods.totalValue.call();
                data[i].totalValue = await totalValueFunc.call();
            }
            this.setState({ dataset: data })
        }));
    }

    showData() {
        let output = []
        let dataset = this.state.dataset;
        for (let i = 0; i < dataset.length; i++) {
            output.push(
                <tr key={'row-' + i} id={'row-' + i}>
                    <td>{i + 1}</td>
                    <td onClick={this.showCampaignModal.bind(this, dataset[i].address, dataset[i].name)} className="clickable">
                        {dataset[i].name}
                    </td>
                    <td>
                        {dataset[i].status ? <Badge pill bg="primary">Active</Badge>:
                            dataset[i].totalValue >= dataset[i].goalValue ?
                                <Badge pill bg="success">Successful</Badge> :
                                <Badge pill bg="danger">Canceled</Badge>}
                    </td>
                </tr>
            )
        }
        return output;
    }

    render() {
        const campaignModal = this.state.campaignModal ? (
            <CampaignDetailModal
                modalHandler={this.showCampaignModal.bind(this, this.state.campaignAddress)}
                show={this.state.campaignModal}
                address={this.state.campaignAddress}
                name={this.state.campaignName}
                user={this.state.user}
            />
        ) : null;

        const newCampaignModal = this.state.newCampaignModal ? (
            <NewCampaignModal
                modalHandler={this.showNewCampaignModal.bind(this)}
                show={this.state.newCampaignModal}
                user_id={this.state.user.user_id}
            />
        ) : null;


        return (
            <Container>
                {campaignModal}
                {newCampaignModal}
                <div className="mt-2">
                {this.state.user ?
                <Button variant="secondary" onClick={this.showNewCampaignModal.bind(this)}>
                    New campaign
                </Button> : null
                }
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.showData()}
                    </tbody>
                </Table>
                </div>
            </Container>
        );
    }
}

export default Campaigns;