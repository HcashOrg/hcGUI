import { connect } from "react-redux";
import { selectorMap } from "fp";
import * as sel from "selectors"; 

const mapStateToProps = selectorMap({
    hasUpdateApp: sel.hasUpdateApp,
    downloadLink: sel.downloadLink,
    lastVersion:sel.lastVersion,
    releaseBody:sel.releaseBody,
    getDataConfigAttempt:sel.getDataConfigAttempt
});

export default connect(mapStateToProps);
