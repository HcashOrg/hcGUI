
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors";
import * as ca from "../actions/ControlActions";
import * as oa from '../actions/OmniActions';


const mapStateToProps = selectorMap({
    walletAddressBalances: sel.walletAddressBalances,
    walletAssetsBalances: sel.walletAssetsBalances, 
    validateAddressResponse:sel.validateAddressResponse,
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({
    validateAddress: ca.validateAddress,
    getwalletaddressbalances:oa.getwalletAddressBalances_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);