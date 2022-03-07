import React from 'react';
import CampaignModal from "../../components/campaign/CampaignModal";
import NewCampaignModal from "../../components/newcampaign/NewCampaignModal";
import {Button, Container, Table} from "react-bootstrap";

import "./Campaigns.css"

class Campaigns extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            campaignModal: false,
            campaignAddress: null,
            newCampaignModal: false,
            dataset: []
        }
    }

    componentDidMount() {
        this.getAllCampaigns();
     }

    showCampaignModal(address) {
        const campaignAddress = address !== undefined ? address : null;
        this.setState({
            campaignAddress: campaignAddress,
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
        }).then(response => response.json().then(data => {
            console.log(data);
            this.setState({
                dataset: data
            })
        }));
    }

    showData() {
        let output = []
        let dataset = this.state.dataset;
        for(let i = 0; i < dataset.length; i++) {
            output.push(
            <tr key={'row-' + i} id={'row-' + i}>
                <td>{ i + 1 }</td>
                <td onClick={this.showCampaignModal.bind(this, dataset[i].address)} className="clickable">
                    {dataset[i].address}
                </td>
            </tr>
            )
        }
        return output;
    }

    render() {
        const campaignModal = this.state.campaignModal ? (
            <CampaignModal modalHandler={this.showCampaignModal.bind(this, "test")} show={this.state.campaignModal} address={this.state.campaignAddress}/>
        ) : null;

        const newCampaignModal = this.state.newCampaignModal ? (
            <NewCampaignModal modalHandler={this.showNewCampaignModal.bind(this)} show={this.state.newCampaignModal}/>
        ) : null;


        return (
            <Container>
                {campaignModal}
                {newCampaignModal}
                <Button variant="secondary" onClick={this.showNewCampaignModal.bind(this)}>
                    New campaign
                </Button>
                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
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