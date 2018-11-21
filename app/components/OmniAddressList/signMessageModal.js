import SignMessage from 'views/SecurityPage/SignMessage';
import InfoModal from "modals/InfoModal/Modal"; 
import { FormattedMessage as T } from "react-intl";

export default ({show, onCancelModal,address})=>(<InfoModal
    modalTitle={<h1><T id="messages.menuItemToPublicSignMessage" m="Sign Message"/></h1>} 
    show={show}
    onCancelModal={onCancelModal}
    modalContent={<SignMessage  address={address}/>}
/>)
