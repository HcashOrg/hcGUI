import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

export default ({ show, onCancelModal,
    onSubmit,
    modalTitle,
    operationType,
    token,
    amount, 
    issuer,
    destination }) => (<ConfirmModal
        modalTitle={modalTitle}
        show={show}
        onCancelModal={onCancelModal}
        onSubmit={onSubmit}
        modalContent={<Aux>
            <div className="confirm-modal-content-sendAsset">
                <div className="content-info">
                    <div >
                        <div>
                        <T id="omni.managePage.modal.token" m="token："/>
                        </div>
                        <div>{token}</div>
                    </div>
                    <div>
                        <div>
                        <T id="omni.managePage.modal.amount" m="amount："/>
                        </div>
                        <div>{amount}</div>
                    </div>
                    <div>
                        <div> 
                        <T id="omni.managePage.modal.from" m="from："/>
                        </div>
                        <div>{issuer}</div>
                    </div>
                    <div>
                        <div> 
                            <T id="omni.managePage.modal.to" m="to："/>
                        </div>
                        <div>{destination}</div>
                    </div>
                </div>
               { operationType && operationType.value==1?<div className="content-tips"> 
                <T id="omni.managePage.modal.tips" m="Warning: you are transferring ownership and control of your property. This operation cannot be undone. Please check the new address carefully!"/>
                </div>:null}
            </div>
        </Aux>}
    />)