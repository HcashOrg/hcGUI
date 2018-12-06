import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/card.less";


const FormButton = ({ goBack, onNextStep, disabled }) => (

    <div className="hc-card-buttons">
        {goBack ? <KeyBlueButton
            size="large"
            onClick={() => {
                goBack && goBack()
            }}
            block={false} >
            <T id="formButton.quit" m="Quit" />
        </KeyBlueButton> : null}

        {onNextStep ? <KeyBlueButton
            disabled={disabled}
            size="large"
            onClick={onNextStep}
            block={false} >
            <T id="formButton.nextStep" m="Next step" />
        </KeyBlueButton> : null}
    </div>
);

export default FormButton; 