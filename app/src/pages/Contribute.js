import React from 'react';
import {DrizzleContext} from "@drizzle/react-plugin";
import ContributeCrowdfund from "../components/ContributeCrowdfund";
import {Drizzle} from "@drizzle/store";
import drizzleOptions from "../drizzleOptions";

const drizzle = new Drizzle(drizzleOptions);

class Contribute extends React.Component {

    render() {
        return (
            <DrizzleContext.Provider drizzle={drizzle}>
                <DrizzleContext.Consumer>
                    {drizzleContext => {
                        const { drizzle, drizzleState, initialized } = drizzleContext;

                        if (!initialized) {
                            return "Loading..."
                        }

                        return (
                            <ContributeCrowdfund drizzle={drizzle} drizzleState={drizzleState} />
                        )
                    }}
                </DrizzleContext.Consumer>
            </DrizzleContext.Provider>
        );
    }
}

export default Contribute;