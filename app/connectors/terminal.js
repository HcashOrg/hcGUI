// @flow
import { connect } from "react-redux";
import { selectorMap } from "../fp";
import { bindActionCreators } from "redux";
import * as sel from "../selectors";

const mapStateToProps = selectorMap({ 
    isTestNet:sel.isTestNet,
    walletName:sel.getWalletName
});

const mapDispatchToProps = dispatch => bindActionCreators({
   
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);