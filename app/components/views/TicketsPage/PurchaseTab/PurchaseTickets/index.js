import React from "react";
import { autobind } from "core-decorators";
import { substruct, compose, eq, get } from "fp";
import { spring } from "react-motion";
import PurchaseTicketsForm from "./Form";
import purchaseTickets from "connectors/purchaseTickets";
import PurchaseTicketsAdvanced from "./PurchaseTicketsAdvanced";
import PurchaseTicketsQuickBar from "./PurchaseTicketsQuickBar";
import { injectIntl } from "react-intl";
import {hcToAtoms,atomsToHc,UnitEnum} from '../../../../../helpers/balance'

const MAX_POSSIBLE_FEE_INPUT = 0.1;

@autobind
class PurchaseTickets extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketFeeError: false,
      txFeeError: false,
      expiryError: false,
      isShowingAdvanced: false,
      numTicketsToBuy: 1,
      ticketFee: hcToAtoms(0.001,this.props.currencyDisplay,UnitEnum.hc), // HC/kB
      txFee: hcToAtoms(0.001,this.props.currencyDisplay,UnitEnum.hc), // HC/kB
      conf: 0,
      expiry: 16
    };
  }

  getQuickBarComponent () {
    const { getStakePool } = this;
    const { ticketFee, txFee, expiry } = this.state;
    return [{
      data: <PurchaseTicketsQuickBar {...{
        stakePool: getStakePool(),
        ticketFee,
        txFee,
        expiry,
      }}/>,
      key: "output_0",
      style: {
        height: spring(92),
        opacity: 1,
      }
    }];
  }

  getAdvancedComponent () {
    const v = e => e.target.value;
    const changeTicketFee = e => this.onChangeTicketFee(v(e));
    const changeTxFee = e => this.onChangeTxFee(v(e));
    const changeExpiry = e => this.onChangeExpiry(v(e));
    const { configuredStakePools,
      onShowStakePoolConfig,
      onChangeStakePool,
      intl: { formatMessage }
    } = this.props; 
    const { ticketFee, txFee, expiry,
      ticketFeeError, txFeeError, expiryError } = this.state;
    return [{
      data: <PurchaseTicketsAdvanced {...{
        configuredStakePools,
        stakePool: this.getStakePool(),
        ticketFee,
        txFee,
        expiry,
        ticketFeeError,
        txFeeError,
        expiryError,
        onShowStakePoolConfig,
        onChangeStakePool,
        onChangeTicketFee: changeTicketFee,
        onChangeTxFee: changeTxFee,
        onChangeExpiry: changeExpiry,
        formatMessage,
      }}
      />,
      key: "output_1",
      style: {
        height: spring(270, {stiffness: 170, damping: 17}),
        opacity: spring(1, {stiffness: 120, damping: 17}),
      }
    }];
  }

  willEnter(height) {
    return {
      height: height,
      opacity: 0,
    };
  }

  willLeave() {
    return {
      height: 0,
      opacity: 0,
    };
  }

  render() { 
    return (
      <PurchaseTicketsForm
        {...{
          ...this.props,
          ...this.state,
          canAffordTickets: this.getCanAffordTickets(),
          account: this.getAccount(),
          ...substruct({
            onToggleShowAdvanced: null,
            onchangeNumTickets: null,
            onIncrementNumTickets: null,
            onDecrementNumTickets: null,
            onChangeAccount: null,
            onPurchaseTickets: null,
            getQuickBarComponent: null,
            getAdvancedComponent: null,
            willEnter: null,
            willLeave: null,
          }, this)
        }}
      />
    );
  }

  getStakePool() {
    const pool = this.props.onChangeStakePool ? this.props.stakePool : this.state.stakePool;
    return pool
      ? this.props.configuredStakePools.find(compose(eq(pool.Host), get("Host")))
      : null;
  }

  getAccount() {
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return account && this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  getCanAffordTickets() {
    return this.getAccount() && this.getAccount().spendable > (this.props.ticketPrice * this.state.numTicketsToBuy);
  }

  onHideAdvanced() {
    this.setState({ isShowingAdvanced: false });
  }

  onShowAdvanced() {
    this.setState({ isShowingAdvanced: true });
  }

  onToggleShowAdvanced() {
    this.state.isShowingAdvanced ? this.onHideAdvanced() : this.onShowAdvanced();
  }

  onChangeAccount(account) {
    const { onChangeAccount } = this.props;
    this.setState({ account });
    onChangeAccount && onChangeAccount(account);
  }


  onchangeNumTickets(num) {
    if(!isNaN(num.target.value)||num.target.value >= 0){
      var inputNum = Math.ceil(num.target.value)
      if(inputNum > 200){
        this.setState({ numTicketsToBuy: 200});
      } else {
        this.setState({ numTicketsToBuy: Math.max(1, inputNum)});
      }
    }else {
      this.setState({ numTicketsToBuy: 1 });
    }
  }

  onIncrementNumTickets() {
    this.setState({ numTicketsToBuy:Math.min(200, this.state.numTicketsToBuy + 1)});
  }

  onDecrementNumTickets() {
    const { numTicketsToBuy } = this.state;
    this.setState({
      numTicketsToBuy: (numTicketsToBuy <= 1) ? 1 : (numTicketsToBuy - 1)
    });
  }

  getIsValid() {
    if (!this.getCanAffordTickets()) return false;
    if (this.getErrors()) return false;
    return true;
  }

  onPurchaseTickets(privpass) {
    const { onPurchaseTickets } = this.props;
    if (!this.getIsValid() || !privpass) return;
    onPurchaseTickets && onPurchaseTickets(
      privpass,
      this.getAccount().value,
      this.getAccount().spendable,
      this.state.conf,
      this.state.numTicketsToBuy,
      this.state.expiry,
      atomsToHc(this.state.ticketFee,this.props.currencyDisplay),
      atomsToHc(this.state.txFee,this.props.currencyDisplay),
      this.getStakePool().value
    );
  }

  onChangeTicketFee(ticketFee) { 
    const ticketFeeError = (isNaN(ticketFee) || ticketFee <= 0 || ticketFee >= hcToAtoms(this.props.maxFee,this.props.currencyDisplay,UnitEnum.hc));
    this.setState({
      ticketFee: ticketFee.replace(/[^\d.]/g, ""),
      ticketFeeError: ticketFeeError,
    });

  }

  onChangeTxFee(txFee) { 
    const txFeeError = (isNaN(txFee) || txFee <= 0 || txFee >=  hcToAtoms(this.props.maxFee,this.props.currencyDisplay,UnitEnum.hc));
    this.setState({
      txFee: txFee.replace(/[^\d.]/g, ""),
      txFeeError: txFeeError
    });
  }

  onChangeExpiry(expiry) {
    const expiryError = (isNaN(expiry) || expiry < 0);
    this.setState({
      expiry: expiry.replace(/[^\d.]/g, ""),
      expiryError: expiryError
    });
  }

  getErrors() {
    const { ticketFeeError, txFeeError, expiryError } = this.state;
    return ticketFeeError || txFeeError || expiryError;
  }
}

export default injectIntl(purchaseTickets(PurchaseTickets));
