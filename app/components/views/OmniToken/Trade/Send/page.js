import { compose } from "fp";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { EcosystemScreen } from "shared";
import { InputSelect, FloatInput } from "inputs";
import { KeyBlueButton,FormButton } from "buttons"; 
import ConfirmTradeModal from "./confirmTradeModal";
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

const SendPage = ({
    onEcosystemChanged,

    addressList,
    address,
    onAddressChange,

    asset,
    assetsList,
    onAssetsChange,

    listproperties,
    propertiddesired,
    onChangePropertiddesired,

    amountforsale,
    onChangeAmountforsale,
    amountforsaleError,

    amountdesired,
    onChangeAmountdesired,
    amountdesiredError,

    intl,
    isValid,

    onSend,
    showConfirmSendModal,
    onCancelModal,
    onSubmit,

    router
}) => (
        <div>
            <EcosystemScreen {
                ...{
                    tabTitle: <T id="omni.trade.screen.title" m="Send Trade" />,
                    onEcosystemChanged: onEcosystemChanged
                }
            } />
            <div className="omni-sendForm">
                <div className="sendForm-row">
                    <div className="sendForm-col col-6">
                        <div>
                            <T id="omni.trade.form.Field.assets" m="Asstes Name" />
                        </div>
                        <div><InputSelect className="send-select-account-input" {...{
                            datas: assetsList,
                            onChange: onAssetsChange,
                            labelKey: "name",
                            valueKey: "name",
                        }} /></div>
                    </div>
                    <div className="sendForm-col col-6">
                        <div>
                            <T id="omni.trade.form.Field.sendAddress" m="Sender" />
                        </div>
                        <div><InputSelect className="send-select-account-input" {...{
                            datas: addressList,
                            onChange: onAddressChange,
                            labelKey: "address",
                            valueKey: "address"
                        }} /></div>
                    </div>
                </div>
                <div className="sendForm-row">
                    <div className="sendForm-col col-6">
                        <div>
                            <T id="omni.send.field.sendAmount" m="Send {assetName} (Effective {balance})"
                                values={{ assetName: asset ? asset.name : "", balance: address ? address.balance : 0, }}
                            />
                        </div>
                        <div>
                            <FloatInput
                                showErrors={!!amountforsaleError}
                                invalid={!!amountforsaleError}
                                invalidMessage={amountforsaleError}

                                value={amountforsale}
                                className="send-address-input-amount"
                                placeholder={intl.formatMessage(messages.amountPlaceholder)}
                                onChange={onChangeAmountforsale}
                                maxFracDigits={8}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="omni-sendForm">
                <div className="sendForm-row">
                    <div className="sendForm-col col-6">
                        <div>

                            <T id="omni.trade.form.Field.desiredAmount" m="Desired Amount" />
                        </div>
                        <div>
                            <FloatInput
                                showErrors={!!amountdesiredError}
                                invalid={!!amountdesiredError}
                                invalidMessage={amountdesiredError}

                                value={amountdesired}
                                className="send-address-input-amount"
                                placeholder={intl.formatMessage(messages.amountPlaceholder)}
                                onChange={onChangeAmountdesired}
                                maxFracDigits={8}
                            />
                        </div>
                    </div>
                    <div className="sendForm-col col-6">
                        <div><T id="omni.trade.form.Field.desiredAssets" m="Desired Assets" /></div>
                        <div>
                            <div><InputSelect className="send-select-account-input" {...{
                                datas: listproperties,
                                onChange: onChangePropertiddesired,
                                labelKey: "showName",
                                valueKey: "showName",
                            }} /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="omni-send-button-area">
                <div>
                </div>
                <div>

            
                    <FormButton {
                        ...{
                            goBack:router.goBack,
                            onNextStep: onSend,
                            disabled:!isValid
                        }
                    } />
                    <ConfirmTradeModal
                        {
                        ...{
                            asset,
                            address,
                            amountforsale,
                            amountdesired,
                            propertiddesired,

                            show: showConfirmSendModal,
                            onCancelModal,
                            onSubmit,
                        }
                        } />
                </div>

            </div>

        </div>
    );

export default injectIntl(SendPage);