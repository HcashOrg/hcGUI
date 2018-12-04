import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors"; 
import * as oa from "../actions/OmniActions";
import * as ca from "../actions/ControlActions"


const mapStateToProps = selectorMap({
    trade:sel.trade
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({  
    getTrade:oa.getTrade_func, 
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);