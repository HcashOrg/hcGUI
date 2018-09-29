import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  ticketPrice: sel.ticketPrice,
  spendingAccounts: sel.spendingAccounts,
  rescanRequest: sel.rescanRequest,
  hasTicketsToRevoke: sel.hasTicketsToRevoke,
  maxFee:sel.maxFee,
  currencyDisplay: sel.currencyDisplay
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onPurchaseTickets: ca.purchaseTicketsAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
