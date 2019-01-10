import { FormattedMessage as T } from "react-intl";
import { tsToDate } from "helpers";
import { activeVoteProposals, preVoteProposals, votedProposals, proposals, abandonedProposals } from "connectors";
import {StakeyBounce} from "indicators";
 
import { VotingProgress } from "charts";
 
import { VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED } from "actions/GovernanceActions";

const VoteChoiceText = ({ currentVoteChoice }) => {
    if (!currentVoteChoice) {
        return <div>&nbsp;</div>;
    }

    let voteChoiceString =
        (currentVoteChoice !== "abstain")
            ? (<div><T id="proposal.voted" m="Voted" /> {currentVoteChoice}</div>)
            : <T id="proposal.noVote" m="No vote cast" />;

    return [<VoteChoice currentVoteChoice={currentVoteChoice} key="1"/>,
        <div className="proposal-vote-text" key="2">  {voteChoiceString}  </div>];
};

const VoteChoice = ({ currentVoteChoice }) => <div className={"proposal-vote-choice " + currentVoteChoice} />;

const VoteResults = ({ currentVoteChoice, quorumPass, voteResult }) => {
    return (
        [<div className="top" key="1">
            <VoteChoiceText currentVoteChoice={currentVoteChoice} />
        </div>,
        <div className="bottom" key="2">
            {quorumPass ? voteResult : <T id="proposals.quorumNotMet" m="Quorum not met" />}
        </div>]
    )
};


const ProposalListItem = ({ name, timestamp, token, voteCounts,
    voteStatus, currentVoteChoice, quorumPass, voteResult, modifiedSinceLastAccess,
    votingSinceLastAccess, onClick }) => {

    const isVoting = voteStatus == VOTESTATUS_ACTIVEVOTE;
    const modifiedClassName =
        (!isVoting && modifiedSinceLastAccess) || (isVoting && votingSinceLastAccess)
            ? "proposal-modified-since-last-access"
            : null;

    const className = ["item ", voteResult, modifiedClassName].join(" ");


    return (
        <div className={className} onClick={() => {
            onClick && onClick(token);
        }}>
            <div>
                <div>{name}</div>
                <div>{token}</div>
            </div>
            <div>
                {voteStatus == VOTESTATUS_ACTIVEVOTE && <div className="top">
                    <VoteChoice currentVoteChoice={currentVoteChoice} />
                    <VotingProgress yesNum={voteCounts.yes} noNum={voteCounts.no} />
                </div>
                }
                {voteStatus == VOTESTATUS_VOTED &&
                    <VoteResults  {...{ currentVoteChoice, quorumPass, voteResult }} />
                }

                {voteStatus !== VOTESTATUS_VOTED &&
                    <div className="bottom">
                        <T id="transaction.timestamp"
                            m="{timestamp, date, medium} {timestamp, time, medium}"
                            values={{ timestamp: tsToDate(timestamp) }} />
                    </div>}



            </div>
        </div>
    );
};

const ProposalList = ({ loading, proposals, viewProposalDetails, tsDate, voteEnded, abandonedProposals }) => {
    return (
        <Aux>
            {loading ? <StakeyBounce center={true}/> : proposals && proposals.length
                ? (
                    <div className={voteEnded || abandonedProposals ? "Proposals-list ended" : "Proposals-list"}>
                        {
                            proposals && proposals.map(v => (
                                <ProposalListItem key={v.token} {...v} tsDate={tsDate} onClick={viewProposalDetails} />
                            ))
                        }
                    </div>
                )
                : <T id="noProposals.description" m="No Proposals Available" />
            }
        </Aux>
    )
};

export const ActiveVoteProposals = activeVoteProposals(proposals(ProposalList));
export const PreVoteProposals = preVoteProposals(proposals(ProposalList));
export const VotedProposals = votedProposals(proposals(ProposalList));
export const AbandonedProposals = abandonedProposals(proposals(ProposalList));
