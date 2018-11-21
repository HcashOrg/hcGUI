import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

export default ({ show, onCancelModal,
    amount,
    name,
    address,
    destination,
    onSubmit }) => (<ConfirmModal
        modalTitle={<T id="omni.send.confirmSendTitle" m="Confirm the transaction" />}
        show={show}
        onCancelModal={onCancelModal}
        onSubmit={onSubmit}
        modalContent={
            <div className="confirmAssetsModal-content">
                <div>
                    <div> <T id="omni.send.field.sendAddress" m="Sender" />：</div>
                    <div>{address}</div>
                </div>
                <div>
                    <div><T id="omni.send.field.Recipient" m="Recipient" />：</div>
                    <div>{destination} </div>
                </div>
                <div>
                <div><T id="send.confirmAmountLabel" m="Please confirm your transaction for" />：</div>
                <div>   {amount} {name}</div>
                </div>

            </div>
        }
    />)