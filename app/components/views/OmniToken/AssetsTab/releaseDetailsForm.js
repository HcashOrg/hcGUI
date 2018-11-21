import { compose } from "fp";
import Card from "card";
import { InputSelect, FloatInput,AddressInput } from "inputs";
import { omniIssuanceForm } from "connectors";
import { FormattedMessage as T } from "react-intl";
import "style/omniForm.less";


class ReleaseDetailForm extends React.PureComponent {
    // componentDidMount = () => {
    //     this.props.onAddressChange(this.props.walletAddressBalances[0]);
    // }
    render() {
        const {
            onAddressChange,
            amountError,
            amount,
            onAmountChange, walletAddressBalances, amountDisabled,
            address,
            addressError } = this.props;

        return <Card title={<T id="omni.assets.infoForm.cardTitle.releaseDetails" m="Release details" />}>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div>
                        <T id="omni.assets.infoForm.numberOfToken" m="Number of token (number of expected inputs)" />
                    </div>
                    <div> <FloatInput
                        showErrors={!!amountError}
                        invalid={!!amountError}
                        invalidMessage={amountError}
                        hidden={false}
                        value={amount}
                        className="send-address-input-amount"
                        onChange={compose(onAmountChange, e => e.target.value)}
                        maxFracDigits={8}
                        required={true}
                        placeholder={amountDisabled?"Managed Property Amounts are issued after creation":""}
                        disabled={amountDisabled}
                    />
                    </div>
                </div>
                <div className="col col-sm-6">
                    <div>
                        <T id="omni.assets.infoForm.issueAddress" m="Issue address" />
                    </div>
                    <div>
                        {/* <InputSelect className="send-select-account-input" {...{
                        datas: walletAddressBalances,
                        onChange: onAddressChange,
                        labelKey: "address",
                        valueKey: "address",
                    }} /> */} 
                     <AddressInput 
                                showErrors={!!addressError}
                                invalid={!!addressError}
                                invalidMessage={addressError}
                                value={address}
                                className="send-address-hash-to" 
                                onChange={compose(onAddressChange, e => e.target.value)}
                            />
                    </div>
                </div>
            </div>

             {/*<div className="omni-form-row">

                <div className="col col-sm-6">
                    <div>Miner Fees (HC) ( HC 有效的)</div>
                    <div>
                        <FloatInput
                            showErrors={!!feesError}
                            invalid={!!feesError}
                            invalidMessage={feesError}
                            hidden={false}
                            value={fees}
                            className="send-address-input-amount"
                            placeholder={0.002}
                            onChange={compose(onFeesChange, e => e.target.value)}
                            maxFracDigits={8}
                            required={true}
                        />
                    </div>
                </div> 

            </div>*/}
        </Card>
    }
}

export default omniIssuanceForm(ReleaseDetailForm);