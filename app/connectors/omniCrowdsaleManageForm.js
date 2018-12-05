import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";  
import * as sel from "selectors";   
import * as oa from "../actions/OmniActions"

const mapStateToProps = selectorMap({ 
      walletAssetsBalances: sel.walletAssetsBalances, 
      crowdsale:sel.crowdsale
  });
  
  const mapDispatchToProps = (dispatch) => bindActionCreators({   
    getCrowdsale:oa.getCrowdsale_fun,
    send_func:oa.send_func,
  }, dispatch);
  
  export default connect(mapStateToProps,mapDispatchToProps);