import React from 'react';
import {DrizzleContext} from "@drizzle/react-plugin";
import CampaignDetail from "../drizzleComponents/campaignDetail/CampaignDetail";
import {Button, Modal} from "react-bootstrap";

class CampaignDetailModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal centered size="lg" show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.name}</Modal.Title>
                </Modal.Header>
                <DrizzleContext.Consumer>
                    {drizzleContext => {
                        const {drizzle, drizzleState, initialized} =  drizzleContext;
                        if (!initialized) {
                            return "Loading..."
                        }
                        return (
                            <CampaignDetail
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                                user={this.props.user}
                                name={this.props.name}
                                address={this.props.address}
                            />
                        )
                    }}
                </DrizzleContext.Consumer>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CampaignDetailModal;