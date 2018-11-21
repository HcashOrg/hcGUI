
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "selectors"; 
import * as oa from '../actions/OmniActions';


const mapStateToProps = selectorMap({
    property: sel.property,  
    isTestNet: sel.isTestNet,
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({ 
    getproperty:oa.getproperty_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);