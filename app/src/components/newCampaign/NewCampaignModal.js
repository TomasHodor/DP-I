import React from 'react';
import {Button, Modal} from "react-bootstrap";
import CampaignCreation from "../drizzleComponents/campaignCreation/CampaignCreation";

class NewCampaignModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            campaignOwner: '',
            address: ''
        };
        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({ show: false });
        this.props.closeHandler();
    }

    render() {
        return (
            <Modal centered size="lg" show={this.state.show} onHide={this.handleClose} >
                <Modal.Body>
                    <CampaignCreation
                        user_id={this.props.user_id}
                        handleClose={this.handleClose}
                    />
                </Modal.Body>
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