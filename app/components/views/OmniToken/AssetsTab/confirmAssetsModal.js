
import {ConfirmAssetsModalContent,ConfirmModal} from "modals";
import { FormattedMessage as T} from "react-intl"; 

export default ({ show, onCancelModal, name,
    category,
    subCategory,
    url,
    description,
    address,
    amount,
    onSubmit }) => (<ConfirmModal
        modalTitle={<T id="omni.confirm.CreateAssets" m="Create Assets" />}
        show={show}
        onCancelModal={onCancelModal}
        onSubmit={onSubmit}
        modalContent={<ConfirmAssetsModalContent {...{
            name,
            category,
            subCategory,
            url,
            description,
            address,
            amount
        }} />}
    />)