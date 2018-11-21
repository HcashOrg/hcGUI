 import "style/ReceivePage.less"; 
 import { FormattedMessage as T } from "react-intl";

 export default ({addr,pubKey}) => (
  <div className="pubKeymodal-content">
    <div>
      <div><T id="omni,asstes.address" m="address" />：</div>
      <div>{addr}</div></div>
    <div>
    <div><T id="omni.addressPage.publicKey" m="public key" />：</div>
    <div>{pubKey} </div>
  </div>
</div>
);

 
