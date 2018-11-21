
import {ConfirmCrowdsaleModalContent,ConfirmModal} from "modals";
import { FormattedMessage as T} from "react-intl"; 

export default ({ show, onCancelModal, name,
    category,
    subCategory,
    url,
    description,
    fromAddress, 
    onSubmit,
    earlyBonus,
    issuerPercentage,
    deadline,
    selectedCurrency }) => (<ConfirmModal
        modalTitle={<T id="omni.confirm.CreateAssets" m="Create Assets" />}
        show={show}
        onCancelModal={onCancelModal}
        onSubmit={onSubmit}
        modalContent={<ConfirmCrowdsaleModalContent {...{
            name,
            category,
            subCategory,
            url,
            description,
            fromAddress,
            earlyBonus,
            issuerPercentage,
            deadline,
            selectedCurrency
        }} />}
    />)