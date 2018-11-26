import Screen from 'shared/screen';
import { compose } from "fp";
import { FormattedMessage as T, injectIntl } from "react-intl";
import { FloatInput, InputSelect, AddressInput } from "inputs";
import { KeyBlueButton } from "buttons";

import ConfirmSendModal from "./confirmSendModal";


const MeanageForm = ({ addressError, destination, operationTypes, operationType, detail, onChangeOutputDestination,
    amountError, onChangeOutputAmount, amount, onOperationTypeChange, isValid, onSend, onSubmit, showConfirmSendModal, onCancelModal,
    goBack,
    modalTitle,
    destinationTips
}) => (
        <Aux>
            <Screen title={<T id="omni.managePage.title" m="Manage Assets" />} />
            <div className="omni-assets-name">
                <span> {detail.name}</span>  <span>{`(ID:${detail.propertyid})`}</span>
            </div>
            <div className="omni-sendForm">
                <div className="sendForm-panel">
                    <div> 
                        <T id="omni.managePage.form.operationType" m="Select hosting operation" />
                        </div>
                    <div>
                        <InputSelect className="send-select-account-input" {...{
                            datas: operationTypes,
                            onChange: onOperationTypeChange,
                            labelKey: "name",
                            valueKey: "name",
                        }} /></div>
                </div>
                <div className="sendForm-panel">
                    <div> 
                        <T id="omni.managePage.form.sendaddress" m="Sender" />
                        </div>
                    <div>
                        <AddressInput value={detail.issuer}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>
            {
                operationType && operationType.value == 1 ? <div className="omni-sendForm">


                    <div className="sendForm-panel">
                        <div> 
                            <T id="omni.managePage.form.recipient" m="Recipient" />
                        </div>
                        <div>
                            <AddressInput
                                autoFocus={true}
                                showErrors={!!addressError}
                                invalid={!!addressError}
                                invalidMessage={addressError}
                                value={destination}
                                className="send-address-hash-to"
                                placeholder={destinationTips}
                                onChange={compose(onChangeOutputDestination, e => e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="sendForm-panel"></div>
                </div> : null
            }
            {operationType && operationType.value == 2 ? <div className="omni-sendForm">
                <div className="sendForm-panel">
                    <div> 
                         <T id="omni.managePage.form.grant" m="Grant {name}" values={{name:`${detail.name} (ID:${detail.propertyid})`}}/>
                    </div>
                    <div>
                        <FloatInput
                            showErrors={!!amountError}
                            invalid={!!amountError}
                            invalidMessage={amountError}
                            hidden={false}
                            value={amount}
                            className="send-address-input-amount"
                            placeholder="1.00000000"
                            onChange={onChangeOutputAmount}
                            maxFracDigits={8}
                        />
                    </div>
                </div>

                <div className="sendForm-panel">
                    <div>
                    <T id="omni.managePage.form.recipient" m="Recipient" />
                        </div>
                    <div>
                        <AddressInput 
                            showErrors={!!addressError}
                            invalid={!!addressError}
                            invalidMessage={addressError}
                            value={destination}
                            className="send-address-hash-to"
                            placeholder={destinationTips}
                            onChange={compose(onChangeOutputDestination, e => e.target.value)}
                        />
                    </div>
                </div>
            </div> : null
            }
            {operationType && operationType.value == 3 ? <div className="omni-sendForm">


                <div className="sendForm-panel">
                    <div>
                         <T id="omni.managePage.form.revoke" m="revoke {name}" values={{name:`${detail.name} (ID:${detail.propertyid})`}}/>
                    </div>
                    <div>
                        <FloatInput
                            showErrors={!!amountError}
                            invalid={!!amountError}
                            invalidMessage={amountError}
                            hidden={false}
                            value={amount}
                            className="send-address-input-amount"
                            placeholder="1.00000000"
                            onChange={onChangeOutputAmount}
                            maxFracDigits={8}
                        />
                    </div>
                </div>
                <div className="sendForm-panel"></div>
            </div> : null
            }
            <div className="omni-send-button-area">
                <div></div>
                <div className="omni-send-buttons">
                    <KeyBlueButton
                        size="large"
                        className="hc-card-buttons-exit"
                        onClick={goBack}
                        block={false} >
                        <T id="formButton.quit" m="Quit" />
                    </KeyBlueButton>
                    <KeyBlueButton
                        disabled={!isValid}
                        size="large"
                        onClick={onSend}
                        block={false} >
                        <T id="formButton.nextStep" m="Next step" />
                    </KeyBlueButton>
                    <ConfirmSendModal {
                        ...{
                            show: showConfirmSendModal,
                            onCancelModal,
                            onSubmit,
                            token:`${detail.name} (ID:${detail.propertyid})`,
                            amount, 
                            issuer:detail.issuer,
                            destination,
                            operationType,
                            modalTitle
                        }
                    }
                    />
                </div>
            </div>
        </Aux>
    );
export default injectIntl(MeanageForm);