import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors";

const mapStateToProps = selectorMap({
    hasUpdateApp: sel.hasUpdateApp,
    downloadLink: sel.downloadLink,
});

export default connect(mapStateToProps);
