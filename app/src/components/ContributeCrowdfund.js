import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

class ContributeCrowdfund extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            address: ''
        };

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    handleValueChange(event) {
        this.setState({value: event.target.value});
    }

    handleAddressChange(event) {
        this.setState({address: event.target.value});
    }

    render() {
        return (
            <div className="section">
                <h2>Contribute to Crowdfund</h2>
                <p>
                    <strong>Owner: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaignInit"
                        method="ownerAddress"
                    />
                </p>
                <p>
                    <strong>Total Value: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaignInit"
                        method="totalValue"
                    />
                </p>
                <p>
                    <strong>Pledged Goal: </strong>
                    <ContractData
                        drizzle={this.props.drizzle}
                        drizzleState={this.props.drizzleState}
                        contract="CrowdfundingCampaignInit"
                        method="goalValue"
                    />
                </p>
                <label>Value</label>
                <input type="text" value={this.state.value} onChange={this.handleValueChange} />
                <label>Address</label>
                <input type="text" value={this.state.address} onChange={this.handleAddressChange} />
                {/*<label>Description</label>*/}
                {/*<input type="text" value={this.state.address} onChange={this.handleAddressChange} />*/}
                <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaignInit" method="contribute" sendArgs={{ value: this.state.value, from: this.state.address }}   />
                <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaignInit" method="contribute2" sendArgs={{ from: this.state.address }} />
                <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaignInit" method="contribute3"  />
            </div>
        )
    }
}

export default ContributeCrowdfund;

