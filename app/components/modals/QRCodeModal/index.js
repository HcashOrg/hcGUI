import Modal from "../Modal";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  modalContent: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired
};

const QRCodeModal = ({modalTitle, modalContent, show, onCancelModal}) => (
  <Modal className="qrcode-modal" {...{show}}>
    <div className="qrcode-modal-header">
      <div className="qrcode-modal-header-title">
        {modalTitle}
      </div>
      <SlateGrayButton className="qrcode-modal-close-button" onClick={onCancelModal}>
        <T id="infoModal.btnClose" m="Close" />
      </SlateGrayButton>
    </div>
    <div className="qrcode-modal-content">
      {modalContent}
    </div>
  </Modal>
);

QRCodeModal.propTypes = propTypes;

export default QRCodeModal;
