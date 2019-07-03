import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

export default ({ destination,amount }) => (<div className="confirmAssetsModal-content">
    <div>
        <div><T id="omni.send.field.Recipient" m="Recipient" />：</div>
        <div>{destination} </div>
    </div>
    <div>
    <div><T id="send.confirmAmountLabel" m="Please confirm your transaction for" />：</div>
    <div>   {amount}</div>
    </div>

</div>)