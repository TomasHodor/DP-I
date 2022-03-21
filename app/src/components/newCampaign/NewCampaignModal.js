import React from 'react';
import {Button, Modal} from "react-bootstrap";
import {DrizzleContext} from "@drizzle/react-plugin";
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
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal centered size="lg" show={this.state.show} onHide={this.handleClose}>
                <DrizzleContext.Consumer>
                    {drizzleContext => {
                        const {drizzle, drizzleState, initialized} =  drizzleContext;

                        if (!initialized) {
                            return "Loading..."
                        }

                        return (
                            <CampaignCreation
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                                user_id={this.props.user_id}
                                handleClose={this.handleClose}
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

export default NewCampaignModal;