import { proposals } from "connectors";
import Detail from "./page";
import {StakeyBounce} from "indicators";
import { ProposalError } from "./helpers";

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { newVoteChoice: null }
    }

    onVoteOptionSelected = (opt) => {
        this.setState({ newVoteChoice: opt })
    }

    onUpdateVoteChoice = (privatePassphrase) => {
        if (!this.state.newVoteChoice) return;
        if (!this.props.viewedProposalDetails) return;

        this.props.updateVoteChoice(this.props.viewedProposalDetails,
            this.state.newVoteChoice, privatePassphrase);
        this.setState({ newVoteChoice: null });
    }


    render() {
        const { getProposalAttempt, getProposalError } = this.props;
        if (getProposalAttempt) return <Aux>
            <div className="tab-card">
            <StakeyBounce center={true}/>
        </div>
        </Aux>;
        if (getProposalError) return <ProposalError error={getProposalError} ></ProposalError>;
 
        return <Aux>
            <div className="tab-card">
                <Detail
                    {...this.props}
                    {...this.state}
                    onVoteOptionSelected={this.onVoteOptionSelected}
                    onUpdateVoteChoice={this.onUpdateVoteChoice}
                />
            </div>
        </Aux>
    }

}
export default proposals(Index);