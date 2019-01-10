import { shell } from "electron";
import GovernanceTab from "../../TicketsPage/GovernanceTab";
import "style/Governance.less";
import { FormattedMessage as T } from "react-intl";

const IndexPage = ({ children }) => (

    <Aux>
        <div className="tab-card">
            <div className="community-header">
                <div>
                    <div className="title"><T id="votingPreferences.title" m="Consensus Changes" /></div>
                    <div><T id="votingPreferences.description" m="Consensus changes refer to the on-chain governance aspect of Hc. This means deciding whether to adopt changes to the consensus rules of the network. Participation in voting requires (PoS) tickets." /></div>
                </div>
                {/* <div className="links">
                    <button className="send-operation-btn" onClick={()=>{
                         shell.openExternal("https://autonomy.h.cash/")
                    }}><T id="votingPreferences.dashboard" m="Voting Dashboard" /></button>
                </div> */}
            </div>

            <GovernanceTab />
        </div>
    </Aux>

);
export default IndexPage;