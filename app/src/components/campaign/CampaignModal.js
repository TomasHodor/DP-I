import React from 'react';
import {DrizzleContext} from "@drizzle/react-plugin";
import ContributeCrowdfund from "../ContributeCrowdfund";
import {Drizzle} from "@drizzle/store";
import drizzleOptions from "../../drizzleOptions";
import {Button, Modal} from "react-bootstrap";

const drizzle = new Drizzle(drizzleOptions);

class CampaignModal extends React.Component {

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
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.address}</Modal.Title>
                </Modal.Header>
                <DrizzleContext.Provider drizzle={drizzle}>
                    <DrizzleContext.Consumer>
                        {drizzleContext => {
                            const {drizzle, drizzleState, initialized} =  drizzleContext;
                            console.log(drizzleContext);

                            if (!initialized) {
                                return "Loading..."
                            }

                            return (
                                <ContributeCrowdfund drizzle={drizzle} drizzleState={drizzleState}/>
                            )
                        }}
                    </DrizzleContext.Consumer>
                </DrizzleContext.Provider>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CampaignModal;