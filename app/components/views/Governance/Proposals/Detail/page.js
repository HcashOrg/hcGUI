
import { VotingProgress } from "charts";
import { FormattedMessage as T } from "react-intl";
// import { GoBackIconButton } from "buttons";
import { AutonomyLink } from "shared";
import {
    ProposalNotVoting, NoTicketsVotingInfo, OverviewField, OverviewVotingProgressInfo,
    NoElligibleTicketsVotingInfo, UpdatingVoteChoice, TimeValue, ProposalImage,
    ChosenVoteOption, ProposalText, ProposalAbandoned
} from "./helpers";

import { autonomyMarkdownIndexMd, tsToDate, hasImg } from "helpers";
import {
    VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED, VOTESTATUS_ABANDONED
} from "actions/GovernanceActions";

const Detail = ({ viewedProposalDetails,
    showPurchaseTicketsPage, hasTickets, onVoteOptionSelected, onUpdateVoteChoice,
    newVoteChoice, updateVoteChoiceAttempt }) => {

    const { name, token, hasEligibleTickets, voteStatus, voteOptions,
        voteCounts, creator, timestamp, endTimestamp, currentVoteChoice,
        version } = viewedProposalDetails;
    const eligibleTicketCount = viewedProposalDetails.eligibleTickets.length;

    let content = [];
    let images=[]; 
    viewedProposalDetails.files.forEach(f => { 
        if (f.name === "index.md") {
            content.push(<ProposalText key={f.name} text={autonomyMarkdownIndexMd(f.payload)} />);
        } else if (hasImg(f.name)) { 
            images.push(<ProposalImage key={f.name} text={`![image](${f.payload})`} alt={f.name} />)
        }
    });


    const voted = voteStatus === VOTESTATUS_VOTED;
    const voting = voteStatus === VOTESTATUS_ACTIVEVOTE;
    const abandoned = voteStatus === VOTESTATUS_ABANDONED;


    let voteInfo = null;
    if (updateVoteChoiceAttempt) voteInfo = <UpdatingVoteChoice />;
    else if (abandoned) voteInfo = <ProposalAbandoned />;
    else if (voted) voteInfo = <ChosenVoteOption {...{ voteOptions, currentVoteChoice, votingComplete: true }} />;
    else if (!voting) voteInfo = <ProposalNotVoting />;
    else if (!hasTickets) voteInfo = <NoTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
    else if (!hasEligibleTickets) voteInfo = <NoElligibleTicketsVotingInfo {...{ showPurchaseTicketsPage }} />;
    else voteInfo = <ChosenVoteOption {...{ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, eligibleTicketCount, currentVoteChoice, votingComplete: currentVoteChoice !== "abstain" }} />;



    return (
        <div>
            <div className="detail-info">
                <div>
                    <div>{name}</div>
                    <div className="subtitle">  <AutonomyLink path={"/proposals/" + token}>{token}</AutonomyLink></div>
                    <div className="info">
                        <OverviewField
                            label={<T id="proposal.overview.created.label" m="Created by" />}
                            value={creator} />
                        <OverviewField
                            label={<T id="proposal.overview.version.label" m="Version" />}
                            value={version} />
                        <OverviewField
                            label={<T id="proposal.overview.lastUpdated.label" m="Last Updated" />}
                            value={<T id="transaction.timestamp"
                                m="{timestamp, date, medium} {timestamp, time, medium}"
                                values={{ timestamp: tsToDate(timestamp) }} />} />
                        {(voting && endTimestamp) ? <OverviewField
                            label={<T id="proposal.overview.deadline.label" m="Voting Deadline" />}
                            value={voting && <T id="transaction.timestamp"
                                m="{timestamp, date, medium} {timestamp, time, medium}"
                                values={{ timestamp: tsToDate(endTimestamp) }} />} /> : null}
                    </div>
                </div>
                <div>
                    {voteInfo}
                </div>
            </div>
            {voting || voted ? <div className="detail-votingProgress">
                <VotingProgress style={{ width: "100%" }} yesNum={voteCounts.yes} showNumber={true} noNum={voteCounts.no} />
            </div> : null}

            <div >
                {[...content,...images]}
            </div>
        </div>

    )
};

export default Detail;