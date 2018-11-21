 
import { FormButton } from "buttons";
import AssetsInfoForm from "./assetsInfoForm";
import ReleaseDetailForm from "./releaseDetailsForm";
import "style/omniForm.less";


const IssuanceForm = ({
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
    addressList,
    onAddressChange,
    amountError,
    amount,
    onAmountChange,
    router,
    onNextStep,
    amountDisabled,
    disabled,
    address,
            addressError,
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
            <ReleaseDetailForm {
                ...{ 
                    addressList,
                    onAddressChange,
                    amountError,
                    amount,
                    onAmountChange,
                    amountDisabled,
                    address,
                    addressError,
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

export default IssuanceForm;