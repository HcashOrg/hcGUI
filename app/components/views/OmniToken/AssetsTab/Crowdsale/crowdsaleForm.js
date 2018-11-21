import { FormButton } from "buttons";
import AssetsInfoForm from "../assetsInfoForm";
import CrowdsaleInfoForm from "./crowdsaleInfoForm";

import "style/omniForm.less";


const CrowdsaleForm = ({
    onDivisibleEnumchanged,
    nameError,
    name,
    onNameChange,
    onUrlChange,
    url,
    urlError,
    onCategoryChange,
    onSubCategoryChange,
    onAssetDescriptionChange,
    description,
    router,
    onNextStep,
    disabled,

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
}) => {
    return (
        <div>
            <AssetsInfoForm {
                ...{
                    onDivisibleEnumchanged,
                    nameError,
                    name,
                    onNameChange,
                    onUrlChange,
                    url,
                    urlError,
                    onAssetDescriptionChange,
                    description,
                    onCategoryChange,
                    onSubCategoryChange,
                }
            } />
            <CrowdsaleInfoForm
                {
                ...{
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
                }
                }
            />
            <FormButton {
                ...{
                    router,
                    onNextStep: onNextStep,
                    disabled
                }
            } />
        </div>
    )
};

export default CrowdsaleForm;