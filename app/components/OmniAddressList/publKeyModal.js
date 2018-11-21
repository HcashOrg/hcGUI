 
import QRCodeModal from "modals/QRCodeModal";
import PubKeyModalContent from "modals/PubKeyModalContent";
import { FormattedMessage as T } from "react-intl";

export default ({show, onCancelModal,addr,pubKey})=>(<QRCodeModal
    modalTitle={<h1><T id="omni,asstes.address" m="address" /></h1>} 
    show={show}
    onCancelModal={onCancelModal}
    modalContent={<PubKeyModalContent {...{addr,pubKey}} />}
/>)