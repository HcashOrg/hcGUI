import Screen from 'shared/screen'; 
import { FormattedMessage as T, injectIntl } from "react-intl";
import { FloatInput, Input, AddressInput, InputSelect } from "inputs";
import { KeyBlueButton } from "buttons";
import { ConfirmSendModalContent } from "Modals";

const CrowdsaleManageForm = ({ data, goBack,
    onSend,
    onChangeOutputAmount,
    onAddressChange,
    amountError,
    amount,
    redeemaddress,
    assetsDesired,
    isValid,

    showConfirmSendModal,
    onCancelModal,
    onSubmit
}) => (
        <Aux>
            <Screen title={<T id="omni.Participatecrowdsale.title" m="Participate Crowdsale" />} /> 
            <div className="omni-sendForm">
                <div className="sendForm-panel">
                    <div>
                       
                        <T id="omni.Participatecrowdsale.assetsName" m="Name" />
                        </div>
                    <div>
                        <Input
                            disabled={true}
                            value={`${data.assetsName} (${data.propertyiddesired})`}
                            className="send-address-hash-toAssetAddress"
                        />
                    </div>
                </div>
                <div className="sendForm-panel">
                    <div>
                    <T id="omni.send.field.sendAddress" m="Sender" />
                        </div>
                    <div>
                        <AddressInput value={data.issuer}
                            disabled={true}
                        />
                    </div>
                </div>
            </div>

            <div className="omni-sendForm">
                <div className="sendForm-panel">
                    <div>
                    <T id="omni.Participatecrowdsale.amount" m="Amount (valid: {redeemaddress})"  values={{
                        redeemaddress:`${redeemaddress ? redeemaddress.balance : "0.00"}  ${data.assetsName} (#${data.propertyiddesired})`
                    }}/>
                         
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
                    <div><T id="omni.send.field.Recipient" m="Recipient" /></div>
                        </div>
                    <div>

                        <InputSelect className="send-select-account-input" {...{
                            datas: assetsDesired,
                            onChange: onAddressChange,
                            labelKey: "address",
                            valueKey: "address"
                        }} />

                    </div>
                </div>
            </div>
            {/* onChange={compose(onChangeOutputDestination, e => e.target.value)} */}
            <div className="omni-send-button-area">
                <div>
                <T id="omni.Participatecrowdsale.tips" m="You will receive {amount} {name} if you participate at this level."  values={{
                        amount:amount,
                        name:data.name
                    }}/>
                </div>
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
                    <ConfirmSendModalContent {
                        ...{
                            show: showConfirmSendModal,
                            onCancelModal,
                            onSubmit,
                            amount,
                            name: data.assetsName,
                            destination: redeemaddress ? redeemaddress.address : "",
                            address: data.issuer
                        }
                    }
                    />
                </div>
            </div>
        </Aux>
    );
export default injectIntl(CrowdsaleManageForm);