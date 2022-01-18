import React from "react";
import { newContextComponents } from "@drizzle/react-components";

const { ContractData, ContractForm } = newContextComponents;

class ContributeCrowdfund extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: '', address: ''};

        this.handleValueChange = this.handleValueChange.bind(this);
        this.handleAddressChange = this.handleAddressChange.bind(this);
    }

    handleValueChange(event) {
        console.log(event.target.value)
        this.setState({value: event.target.value});
    }


    handleAddressChange(event) {
        console.log(event.target.value)
        this.setState({address: event.target.value});
    }

    render() {
        return (
            <div className="App">
                <div>
                    <h1>Drizzle Examples</h1>
                    <p>
                        Examples of how to get started with Drizzle in various situations.
                    </p>
                </div>

                <div className="section">
                    <h2>Contribute to Crowdfund</h2>
                    <p>
                        <strong>Owner: </strong>
                        <ContractData
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            contract="CrowdfundingCampaign"
                            method="owner"
                        />
                    </p>
                    <p>
                        <strong>Total Value: </strong>
                        <ContractData
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            contract="CrowdfundingCampaign"
                            method="totalValue"
                        />
                    </p>
                    <p>
                        <strong>MinimumContribution: </strong>
                        <ContractData
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            contract="CrowdfundingCampaign"
                            method="minimumContribution"
                        />
                    </p>
                    <label>Value</label>
                    <input type="text" value={this.state.value} onChange={this.handleValueChange} />
                    <label>Address</label>
                    <input type="text" value={this.state.address} onChange={this.handleAddressChange} />
                    <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaign" method="contribute" sendArgs={{ value: this.state.value, from: this.state.address }}   />
                    <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaign" method="contribute2" sendArgs={{ from: this.state.address }} />
                    <ContractForm drizzle={this.props.drizzle} contract="CrowdfundingCampaign" method="contribute3"  />
                </div>
            </div>
        )
    }
}

export default ContributeCrowdfund;

