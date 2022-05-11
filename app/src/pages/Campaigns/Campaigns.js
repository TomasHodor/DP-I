import React from 'react';
import CampaignDetailModal from "../../components/campaignDetail/CampaignDetailModal";
import NewCampaignModal from "../../components/newCampaign/NewCampaignModal";
import {Badge, Button, Container, Table} from "react-bootstrap";
import {renderEtherValue} from "../../components/utils";
import web3 from "../../web3Instance"
import "./Campaigns.css"
import nodejs_connection from "../../nodejsInstance";

import CrowdfundingCampaign from "../../contracts/CrowdfundingCampaign.json";

class Campaigns extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            campaignAddress: null,
            campaignName: null,
            campaignModal: false,
            newCampaignModal: false,
            user: this.props.user,
            dataset: [],
        }
    }

    componentDidMount() {
        this.getAllCampaigns();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user) {
            this.setState({ user: this.props.user });
        }
    }

    showCampaignModal(address, name) {
        const campaignAddress = address !== undefined ? address : null;
        const campaignName = name !== undefined ? name : null;

        this.setState({
            campaignAddress: campaignAddress,
            campaignName: campaignName,
            campaignModal: true
        });
    }

    closeCampaignModal() {
        if (this.state.campaignModal)
            this.getAllCampaigns();
        this.setState({
            campaignModal: false
        });
    }

    showNewCampaignModal() {
        this.setState({ newCampaignModal: true });
    }

    closeNewCampaignModal() {
        if (this.state.newCampaignModal)
            this.getAllCampaigns();
        this.setState({ newCampaignModal: false });
    }

    getAllCampaigns() {
        fetch(nodejs_connection +'/campaign', {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json().then(async data => {
            for (let i = 0; i < data.length; i++) {
                let web3Contract = new web3.eth.Contract(CrowdfundingCampaign.abi, data[i].address);
                let nameFunc = await web3Contract.methods.campaignName.call();
                data[i].name = await nameFunc.call();
                let statusFunc = await web3Contract.methods.campaignStatus.call();
                data[i].status = await statusFunc.call();
                let goalValueFunc = await web3Contract.methods.goalValue.call();
                data[i].goalValue = parseInt(await goalValueFunc.call());
                let totalValueFunc = await web3Contract.methods.totalValue.call();
                data[i].totalValue = parseInt(await totalValueFunc.call());
            }
            this.setState({ dataset: data })
        }));
    }

    showData() {
        let output = []
        let dataset = this.state.dataset;
        for (let i = 0; i < dataset.length; i++) {
            output.push(
                <tr key={'row-' + i} id={'row-' + i} className="clickable">
                    <td>{i + 1}</td>
                    <td onClick={this.showCampaignModal.bind(this, dataset[i].address, dataset[i].name)}>
                        {dataset[i].name}
                    </td>
                    <td>
                        {dataset[i].status === "active" ? <Badge pill bg="primary">Active</Badge> :
                            dataset[i].status === "finished" ?
                                <Badge pill bg="success">Successful</Badge> :
                                <Badge pill bg="danger">Canceled</Badge>}
                    </td>
                    <td>
                        {renderEtherValue(dataset[i].goalValue)}
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
                closeHandler={this.closeCampaignModal.bind(this)}
                show={this.state.campaignModal}
                address={this.state.campaignAddress}
                name={this.state.campaignName}
                user={this.state.user}
            />
        ) : null;

        const newCampaignModal = this.state.newCampaignModal ? (
            <NewCampaignModal
                modalHandler={this.showNewCampaignModal.bind(this)}
                closeHandler={this.closeNewCampaignModal.bind(this)}
                show={this.state.newCampaignModal}
                user_id={this.state.user.user_id}
            />
        ) : null;

        return (
            <Container>
                {campaignModal}
                {newCampaignModal}
                { this.state.user ?
                    <Button
                        variant="secondary" className="mt-2"
                        onClick={this.showNewCampaignModal.bind(this)}>New campaign
                    </Button> : null }
                <Table striped bordered hover className="mt-2" size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Campaign Name</th>
                            <th>Status</th>
                            <th>Goal Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    {this.showData()}
                    </tbody>
                </Table>
            </Container>
        );
    }
}

export default Campaigns;