import { compose } from "fp";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AddressInput, InputSelect, FloatInput } from "inputs";
import { KeyBlueButton } from "buttons";

import ConfirmSendModal from "./confirmSendModal"
import 'style/OmniSendPage.less';


const messages = defineMessages({
    destinationAddrPlaceholder: {
        id: "send.destinationAddrPlaceholder",
        defaultMessage: "Destination Address"
    },
    amountPlaceholder: {
        id: "send.amountPlaceholder",
        defaultMessage: "Amount"
    }
});

const SendTabPage = ({
    addressList,
    onAddressChange,
    assetsList,
    onAssetsChange,
    addressError,
    amountError,
    destination,
    amount,
    getOnChangeOutputDestination,
    getOnChangeOutputAmount,
    address,
    asset,
    intl,
    isValid,

    onSend,
    showConfirmSendModal,
    onCancelModal,
    onSubmit,
}) => (
        <Aux>
            <div className="tab-card">
                <div className="omni-sendForm">
                    <div className="sendForm-panel">
                        <div>
                            <T id="omni.send.field.choiceCurrency" m="Choice of currency" />
                        </div>
                        <div><InputSelect className="send-select-account-input" {...{
                            datas: assetsList,
                            onChange: onAssetsChange,
                            labelKey: "name",
                            valueKey: "name",
                        }} /></div>
                    </div>
                    <div className="sendForm-panel">
                        <div>
                            <T id="omni.send.field.sendAddress" m="Sender" />
                        </div>
                        <div><InputSelect className="send-select-account-input" {...{
                            datas: addressList,
                            onChange: onAddressChange,
                            labelKey: "address",
                            valueKey: "address"
                        }} /></div>
                    </div>
                </div>
                <div className="omni-sendForm">
                    <div className="sendForm-panel">
                        <div>
                            <T id="omni.send.field.sendAmount" m="Send {assetName} (Effective {balance})"
                                values={{ assetName: asset ? asset.name : "",balance: address ? address.balance : 0, }}
                            />
                        </div>
                        <div>
                            <FloatInput
                                showErrors={!!amountError}
                                invalid={!!amountError}
                                invalidMessage={amountError}
                                hidden={false}
                                value={amount}
                                className="send-address-input-amount"
                                placeholder={intl.formatMessage(messages.amountPlaceholder)}
                                onChange={getOnChangeOutputAmount}
                                maxFracDigits={8}
                            />
                        </div>
                    </div>
                    <div className="sendForm-panel">
                        <div><T id="omni.send.field.Recipient" m="Recipient" /></div>
                        <div>
                            <AddressInput
                                autoFocus={true}
                                showErrors={!!addressError}
                                invalid={!!addressError}
                                invalidMessage={addressError}
                                value={destination}
                                className="send-address-hash-to"
                                placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
                                onChange={compose(getOnChangeOutputDestination, e => e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="omni-send-button-area">
                    <div>
                        {/* <p>全部交易费用: 0.00025 HC </p> */}

                        <p>
                            <T id="omni.send.tips.AvailableAddress" m="From available address: {address}"
                                values={{
                                    address: address ? address.address : ""
                                }} />
                        </p>

                        {parseFloat(amount) > parseFloat(address ? address.balance : 0) ? <p className="omni-send-error">

                            <T id="omni.send.tips.errormassge" m="Your sender address does not have enough {assetName} to complete the transaction. Please send at least {balance}{assetName} coverage to estimate total transaction cost."
                                values={{
                                    balance: address ? address.balance : 0,
                                    assetName: asset ? asset.name : ""
                                }} />
                        </p> : null}
                    </div>
                    <div>
                        {/* <PassphraseModalButton
                            modalTitle={<T id="send.sendConfirmations" m="Transaction Confirmation" />}
                            modalDescription={<Aux><T id="send.confirmAmountLabel" m="Please confirm your transaction for" />:  {amount} {asset ? asset.name : ""}</Aux>}
                            disabled={!isValid}
                            className="content-send"
                            onSubmit={onSubmit}
                            loading={false}
                            buttonLabel={<T id="send.sendBtn" m="Send" />}
                        /> */}

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
                                amount,
                                name: asset ? asset.name : "",
                                destination,
                                address: address ? address.address : ""
                            }
                        }
                        />
                    </div>

                </div>

            </div>
        </Aux>
    );

export default injectIntl(SendTabPage);