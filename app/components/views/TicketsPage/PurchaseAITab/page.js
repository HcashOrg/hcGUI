import { PassphraseModalButton, KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/StakePool.less";

const PurchaseAIPage = ({ 
    ifainoderegisted,
    registerAiNode,
    unRegisterAiNode,
}) => (
    <Aux>
    <div className="tab-card">
      
        <br/>
        <KeyBlueButton 
            size="large"
            onClick={()=>{ifainoderegisted?unRegisterAiNode():registerAiNode();}}
            block={false} >
           asdfafasdf
        </KeyBlueButton>
    </div>
  </Aux>
);

export default PurchaseAIPage;