import { connect } from "react-redux";
import { selectorMap } from "fp";
import { bindActionCreators } from "redux"; 
import * as sel from "selectors";
import * as ai from "actions/AIActions"; 

const mapStateToProps = selectorMap({
    ifainoderegisted:sel.ifainoderegisted
});

const mapDispatchToProps = dispatch => bindActionCreators({
    getIfAINodeRegisted:ai.ifAINodeRegisted_func,
    registerAiNode:ai.registerAiNode_func,
    unRegisterAiNode:ai.unRegisterAiNode_func,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);