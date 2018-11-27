import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";  
import * as sel from "selectors";   
import * as oa from "../actions/OmniActions"

const mapStateToProps = selectorMap({ 
      walletAssetsBalances: sel.walletAssetsBalances, 
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({   
    send_func:oa.send_func,
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);