import Card from "card";
import {KeyBlueButton} from "buttons";
import { FormattedMessage as T } from "react-intl";
 

const FormButton = ({ router,onNextStep,disabled }) => (
    <Card> 
    <div className="hc-card-buttons">
        {router?<KeyBlueButton 
            size="large"
            className="hc-card-buttons-exit"
            onClick={()=>{
                router.goBack()
            }}
            block={false} >
            <T id="formButton.quit" m="Quit" />
        </KeyBlueButton>:null}
        <KeyBlueButton
            disabled={disabled}
            size="large"
            onClick={onNextStep}
            block={false} >
            <T id="formButton.nextStep" m="Next step" />
        </KeyBlueButton>
    </div>
</Card>
  );

  export default FormButton; 