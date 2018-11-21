import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";  
import * as sel from "selectors";  
import * as ca from "../actions/ControlActions";
import * as oa from "../actions/OmniActions"

const mapStateToProps = selectorMap({ 
    listProperties:sel.listproperties,
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({   
    validateAddress:ca.validateAddress,
    sendIssuanceCrowdsale:oa.sendIssuanceCrowdsale_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);