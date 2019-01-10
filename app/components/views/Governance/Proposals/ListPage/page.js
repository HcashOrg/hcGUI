// import { VotingProgress } from "charts"
import { FormattedMessage as T } from "react-intl";
import { shell } from "electron";
import { newProposalCounts } from "connectors";
import { ActiveVoteProposals, PreVoteProposals, VotedProposals, AbandonedProposals } from "./proposalList";

const ListLink = ({ count, children, selected, onClick }) => (
    <div className={selected ? "selected" : ""} onClick={onClick}>
        {children}
        {count ? <div className="bubbling">{count}</div> : null}
    </div>
)

const Page = ({ router, tabSelected,
    onTabSelected, newActiveVoteProposalsCount, newPreVoteProposalsCount,autonomyURL }) => (
        <div>
            <div className="community-header">
                <div>
                    <div className="title"><T id="proposals.community.title" m="Proposals" /></div>
                    <div><T id="proposals.community.descr" m="Voting on community proposals allows you to have a say on how the project treasury is spent.Participation in voting requires (PoS) tickets. Proposal creation, discussions and other features are available at" />
                        <a onClick={() => shell.openExternal(autonomyURL)}>autonomy.h.cash</a>
                    </div>
                </div>
                <div className="links">
                    <button className="send-operation-btn" onClick={() => {
                        shell.openExternal(autonomyURL)
                    }}><T id="proposals.community.createLink" m="Create a Proposal" /></button>
                </div>
            </div>
            <div className="tabs">
                <ListLink count={newPreVoteProposalsCount} selected={tabSelected == 1} onClick={() => {
                    onTabSelected && onTabSelected(1);
                }}> <T id="proposals.statusLinks.preVote" m="Under Discussion" /></ListLink>
                <ListLink count={newActiveVoteProposalsCount} selected={tabSelected == 2} onClick={() => {
                    onTabSelected && onTabSelected(2);
                }}> <T id="proposals.statusLinks.underVote" m="Under Vote" /></ListLink>
                <ListLink selected={tabSelected == 3} onClick={() => {
                    onTabSelected && onTabSelected(3);
                }}> <T id="proposals.statusLinks.voted" m="Finished voting" /></ListLink>
                <ListLink selected={tabSelected == 4} onClick={() => {
                    onTabSelected && onTabSelected(4);
                }}> <T id="proposals.statusLinks.abandoned" m="Abandoned" /></ListLink>
            </div>
            {
                tabSelected == 1 && <PreVoteProposals />
            }
            {
                tabSelected == 2 && <ActiveVoteProposals />
            }
            {
                tabSelected == 3 && <VotedProposals />
            }
            {
                tabSelected == 4 && <AbandonedProposals />
            }


        </div>
    )

export default newProposalCounts(Page);