import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

export default ({ show, 
    onCancelModal,
    onSubmit,
    asset,
    address,
    amountforsale,
    amountdesired,
    propertiddesired }) => (<ConfirmModal
        modalTitle={<T id="omni.send.confirmSendTitle" m="Confirm the transaction" />}
        show={show}
        onCancelModal={onCancelModal}
        onSubmit={onSubmit}
        modalContent={
            <div className="confirmAssetsModal-content">
                <div>
                    <div><T id="omni.trade.form.Field.assets" m="Asstes Name"/>：</div>
                    <div>{`${asset?asset.name:""}(${asset?asset.propertyid:null})`}</div>
                </div>
                <div>
                    <div><T id="omni.trade.form.Field.sendAddress" m="Sender"/>：</div>
                    <div>{address?address.address:null} </div>
                </div>
                <div>
                    <div><T id="omni.trade.form.Field.sendAmount" m="Send Amount"/>：</div>
                    <div>   {amountforsale}</div>
                </div>
                <div>
                    <div> <T id="omni.trade.form.Field.desiredAmount" m="Desired Amount"/>：</div>
                    <div>   {amountdesired}</div>
                </div>
                <div>
                    <div><T id="omni.trade.form.Field.desiredAssets" m="Desired Assets" />：</div>
                    <div>  {propertiddesired ? propertiddesired.showName:null}</div>
                </div>
            </div>
        }
    />)