
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";  
import * as sel from "selectors"; 
import * as oa from "../actions/OmniActions";

const mapStateToProps = selectorMap({ 
    listproperties:sel.listproperties,
    activeCrowdsales:sel.activeCrowdsales
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({  
    listpropertiesFunc:oa.listproperties_func,
    getActiveCrowdsales: oa.getActiveCrowdsales_func
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);