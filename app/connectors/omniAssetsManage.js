import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors"; 
import * as ca from '../actions/ControlActions';
import * as oa from "../actions/OmniActions"


const mapStateToProps = selectorMap({
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({ 
    validateAddress: ca.validateAddress,
    sendChangeIssuer:oa.sendChangeIssuer_func,
    sendGrant:oa.sendGrant_func,
    sendrevoke:oa.sendrevoke_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);