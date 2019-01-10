import { connect } from "react-redux";
import * as sel from "../selectors";
import { selectorMap } from "../fp";

const mapStateToProps = selectorMap({
  isTestNet: sel.isTestNet,
  totalBalance: sel.totalBalance,
  ticketPrice: sel.ticketPrice,
  // treasuryBalance:sel.treasuryBalance
});

export default connect(mapStateToProps);
