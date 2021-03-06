import { KeyBlueButton } from "buttons";
import { shell } from "electron";
import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { StakeyBounceXs } from "indicators";
import { VotingProgress } from "charts";
import UpdateVoteChoiceModalButton from "./updateVoteChoiceModalButton";
import { default as ReactMarkdown } from "react-markdown";



export const ProposalError = ({ error }) => <div><T id="proposalDetails.loadingError" m="Error loading Proposal: {error}" values={{ error }} /></div>;

export const ProposalAbandoned = () => <T id="proposalDetails.votingInfo.abandoned" m="Proposal has been abandoned" />;

export const ProposalNotVoting = () => <T id="proposalDetails.votingInfo.notVoting" m="Proposal not yet on voting stage" />;

export const ProposalVoted = () =>
    <div className="proposal-details-voting-voted"><T id="proposalDetails.votingInfo.voted" m="Voting has ended for this proposal" /></div>;

export const NoTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
    <Aux>
        <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noTickets" m="Voting is only available upon participation in Staking." /></div>
        <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.startStakingBtn" m="Start Staking" /></KeyBlueButton>
    </Aux>
);

export const NoElligibleTicketsVotingInfo = ({ showPurchaseTicketsPage }) => (
    <Aux>
        <div className="proposal-details-no-tickets"><T id="proposalDetails.votingInfo.noElligibleTickets" m="You don't have tickets elligible for voting on this proposal. Purchase tickets to vote on future proposals." /></div>
        <KeyBlueButton onClick={showPurchaseTicketsPage}><T id="proposalDetails.votingInfo.purchaseTicketsBtn" m="Purchase Tickets" /></KeyBlueButton>
    </Aux>
);

const VoteOption = ({ value, description, onClick, checked }) => {
    return (
        <div className="proposal-vote-option" onClick={onClick ? () => onClick(value) : null}>
            <input className={value} type="radio" id={value} name="proposalVoteChoice" readOnly={!onClick} onChange={onClick ? () => onClick(value) : null}
                value={value} checked={checked} />
            <label className={"radio-label " + value} htmlFor={value} />{description}
        </div>
    )
};

export const ChosenVoteOption = ({ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice, currentVoteChoice, votingComplete, eligibleTicketCount }) => (
    <Aux>
        <div className="proposal-details-voting-preference">
            <div className="proposal-details-voting-preference-title"><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
            <div className="proposal-details-current-choice-box">
                {voteOptions.map(o => (
                    <VoteOption value={o.id} description={o.id.charAt(0).toUpperCase() + o.id.slice(1)} key={o.id} checked={currentVoteChoice !== "abstain" ? o.id === currentVoteChoice : o.id === newVoteChoice}
                        onClick={!votingComplete ? onVoteOptionSelected : null} />
                ))}
            </div>
        </div>
        {!votingComplete && <UpdateVoteChoiceModalButton {...{ newVoteChoice, onUpdateVoteChoice, eligibleTicketCount }} />}
    </Aux>
);

export const UpdatingVoteChoice = () => (
    <div className="proposal-details-updating-vote-choice">
        <StakeyBounceXs />
        <T id="proposalDetails.votingInfo.updatingVoteChoice" m="Updating vote choice" />...
  </div>
);

export const OverviewField = ({ label, value }) => (<div>
    <div>{label}</div>
    <div>{value}</div>
</div>)

export const OverviewVotingProgressInfo = ({ voteCounts }) => (
    <div className="proposal-details-voting-progress">
        <div className="proposal-details-voting-progress-counts">
            <div className="yes-count-box" />{voteCounts.yes}
            <div className="no-count-box" />{voteCounts.no}
            {/* // TODO: return if we have have quorum/total ticket counts available.
      <div className="abstain-count-box" /><T id="proposal.progressCount.abstain" m="{count} Abstain" values={{ count: voteCounts.abstain }} /> */}
        </div>

        <VotingProgress voteCounts={voteCounts} />
    </div>
);

export const TimeValue = ({ timestamp, tsDate }) => (
    <Aux>
        <span className="time-value"><FormattedRelative value={tsDate(timestamp)} /></span>
        (<T id="proposal.overview.fullTime" m="{timestamp, date, medium} {timestamp, time, short}" values={{ timestamp: tsDate(timestamp) }} />)
  </Aux>
);

// This changes links to never open. Debatable whether we want to
// allow proposals to link somewhere directly from hc.
const renderInternalProposalLink = ({ children, href }) => {
    return <a onClick={() => shell.openExternal(href)} href="#">{children}</a>;
};

const renderProposalImage = (props) => {
    return <img src={props.src} />
};

export const ProposalText = ({ text }) => (
    <ReactMarkdown
        source={text}

        // NEVER set to false
        escapeHtml={true}

        // debatable whether we wanna allow the embedded html sections to be
        // shown. Theoretically, escapeHtml=true should suffice, but playing it
        // safe for the moment and also setting this as true.
        skipHtml={true}

        renderers={{
            link: renderInternalProposalLink,
            linkReference: renderInternalProposalLink,

            // debatable whether we wanna allow inline image references in proposals
            // in hc.
            imageReference: () => renderProposalImage,
            image: () => renderProposalImage,

            html: () => null,
        }}
    />
);



const ImageOrLink = alt => props => {
    return <img src={`data:image/png;base64,${props.src}`} alt={alt} /> 
}
export const ProposalImage = ({ text, alt }) => (
    <ReactMarkdown
        source={text} renderers={{ image: ImageOrLink(alt) }}
    />
);
