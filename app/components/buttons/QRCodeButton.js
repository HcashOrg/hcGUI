import { QRCodeModalButton } from "buttons";
import { QRCodeModalContent } from "modals";
import { FormattedMessage as T } from "react-intl"; 


export default ({addr})=>(<QRCodeModalButton
    modalTitle={<h1><T id="omni,asstes.address" m="address"/></h1>} 
    modalContent={<QRCodeModalContent addr={addr} />}
/>)

