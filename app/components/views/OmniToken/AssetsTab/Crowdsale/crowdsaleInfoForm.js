import { compose } from "fp"; 
import { DateTimeRange } from "datePicker"
import Card from "card";
import { InputSelect, FloatInput, AddressInput,Input } from "inputs";
import { omniIssuanceForm } from "connectors";
import { FormattedMessage as T } from "react-intl";

import "style/react-datepicker.less";

import "style/omniForm.less";


const CrowdsaleInfoForm = ({
    onIssuerPercentageChange,
    issuerPercentage,
    issuerPercentageError,
    deadline,
    onDeadlineChange,
    earlyBonusError,
    earlyBonus,
    onEarlyBonusChange,
    fromAddress,
    fromAddressError,
    onFromAddressChange,
    tokenSperUnit,
    tokenSperUnitError,
    onTokenSperUnitChange,
    listProperties,
    onPropertyiddesiredChange
}) => (
        <Card title={<T id="omni.assets.infoForm.cardTitle.crowdsaleDetails" m="Crowdfunding details" />}>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div> 
                        <T id="omni.assets.infoForm.deadline" m="Deadline" />
                    </div>
                    <div>  <DateTimeRange
                        selected={deadline}
                        onChange={onDeadlineChange}
                    />
                    </div>
                </div>
                <div className="col col-sm-6">
                </div>
            </div>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div> 
                    <T id="omni.assets.infoForm.issuerPercentage" m="Percentage for issuer" />
                    </div>
                    <div>

                        <FloatInput
                            showErrors={!!issuerPercentageError}
                            invalid={!!issuerPercentageError}
                            invalidMessage={issuerPercentageError}
                            hidden={false}
                            value={issuerPercentage}
                            className="send-address-input-amount"
                            onChange={compose(onIssuerPercentageChange, e => e.target.value)}
                            maxFracDigits={8}
                            required={true}
                        />
                    </div>
                </div>
                <div className="col col-sm-6">
                    <div> 
                    <T id="omni.assets.infoForm.earlyBonus" m="Weekly early bird bonus percentage" />
                    </div>
                    <div> 
                        <FloatInput
                            showErrors={!!earlyBonusError}
                            invalid={!!earlyBonusError}
                            invalidMessage={earlyBonusError}
                            hidden={false}
                            value={earlyBonus}
                            className="send-address-input-amount"
                            onChange={compose(onEarlyBonusChange, e => e.target.value)}
                            maxFracDigits={2}
                            required={true}
                        />
                    </div>
                </div>
            </div>
            <div className="omni-form-row omni-form-row-panle">
                <div className="col col-sm-6">
                    <div>  
                    <T id="omni.assets.infoForm.Rates" m="Rates" />
                    </div>
                    <div className="inlineItem">

                        <FloatInput
                            showErrors={!!tokenSperUnitError}
                            invalid={!!tokenSperUnitError}
                            invalidMessage={tokenSperUnitError}
                            hidden={false}
                            value={tokenSperUnit}
                            className="send-address-input-amount"
                            onChange={compose(onTokenSperUnitChange, e => e.target.value)} 
                            required={true} 
                            maxFracDigits={2} 
                            placeholder="# of tokens"
                        />
                    </div>
                </div>
                <div className="col col-sm-6">
                    <div>&nbsp;&nbsp; </div>
                    <div className="inlineItem"> 
                         <T id="omni.assets.infoForm.listPropertiesFirst" m="Every" /> <InputSelect className="send-select-account-input" {...{
                            datas: listProperties,
                            onChange: onPropertyiddesiredChange,
                            labelKey: "showName",
                            valueKey: "propertyid",
                        }} />
                        <T id="omni.assets.infoForm.listPropertiesLast" m="investment" /> 
                    </div>
                </div>
            </div> 

            <div className="omni-form-row">
                
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
                                showErrors={!!fromAddressError}
                                invalid={!!fromAddressError}
                                invalidMessage={fromAddressError}
                                value={fromAddress}
                                className="send-address-hash-to" 
                                onChange={compose(onFromAddressChange, e => e.target.value)}
                            />
                    </div>
                </div>
                <div className="col col-sm-6">
                </div>
            </div>
        </Card>
    )

export default omniIssuanceForm(CrowdsaleInfoForm);