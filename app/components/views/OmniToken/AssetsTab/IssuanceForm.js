
import { FormButton } from "buttons";
import Card from "card";
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
            <Card>
                <FormButton {
                    ...{
                        goBack:router.goBack,
                        onNextStep: onNextStep,
                        disabled
                    }
                } />
            </Card>
        </div>
    )
};

export default IssuanceForm;