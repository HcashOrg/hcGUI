 
 import qr from "qr-image";
 import "style/ReceivePage.less";
 
 class QRCodeModalContent extends React.PureComponent {
   static propTypes = {
     addr: PropTypes.string.isRequired
   };
   render() {
     const {addr} = this.props
     const qr_img = qr.imageSync(addr, {type: "svg"});
     return ([<div className="receive-content-nest-qrimage" dangerouslySetInnerHTML={{__html:qr_img}} key="1"></div>,<div className='receive-content-nest-text' key='2'>
     {addr}
     </div>]);
   }
 }
 
 export default QRCodeModalContent;
 
