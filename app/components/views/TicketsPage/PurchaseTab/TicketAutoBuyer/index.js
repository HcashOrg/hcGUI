import ticketAutoBuyer from "connectors/ticketAutoBuyer";
import { substruct, compose, eq, get } from "fp";
import { injectIntl } from "react-intl";
import { spring } from "react-motion";
import Details from "./Details";
import TicketAutoBuyerForm from "./Form";
import {hcToAtoms,UnitEnum,atomsToHc} from '../../../../../helpers/balance'

@autobind
class TicketAutoBuyer extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      ...this.getCurrentSettings(),
      isHidingDetails: true,
      isScrollingDown: false,
      canNotEnableAutobuyer: false,
      balanceToMaintainError: false,
      maxFeeError: false,
      maxPriceAbsoluteError: false,
      maxPriceRelativeError: false,
      maxPerBlockError: false
    };
  }

  componentDidUpdate() { 
    const {isHidingDetails} = this.state;
    if(!isHidingDetails) {
      this.scrollToBottom();
    }
  }

  scrollTo(element, to, duration) {
    const {isScrollingDown} = this.state;
    if (!isScrollingDown)
      return;
    if (duration <= 0) {
      this.setState({ isScrollingDown: false });
      return;
    }
    const difference = to - element.scrollTop;
    const perTick = difference / duration * 10;

    let intervelId = setTimeout(() => {
      element.scrollTop = element.scrollTop + perTick;
      this.scrollTo(element, to, duration - 10);
      clearTimeout(intervelId);
      intervelId = null;
    }, 10);
  }

  scrollToBottom () {
    const content = document.querySelector(".tab-content");
    this.scrollTo(content, content.scrollHeight, 300);
  }

  getDetailsComponent () {
    const v = e => e.target.value;
    const changeBalanceToMaintain = e => this.onChangeBalanceToMaintain(v(e));
    const changeMaxFee = e => this.onChangeMaxFee(v(e));
    const changeMaxPriceAbsolute = e => this.onChangeMaxPriceAbsolute(v(e));
    const changeMaxPriceRelative = e => this.onChangeMaxPriceRelative(v(e));
    const changeMaxPerBlock = e => this.onChangeMaxPerBlock(v(e));

    const { 
      maxFee,
      currencyDisplay,
      getTicketBuyerConfigResponse,
      intl : { formatMessage }
    } = this.props;
    let isTicketAutoBuyerConfigDirty = this.getIsDirty()
    const { onUpdateTicketAutoBuyerConfig } = this; 
    return [{
      data: <Details {...{
        ...this.state,
        isTicketAutoBuyerConfigDirty,
        getTicketBuyerConfigResponse,
        formatMessage,
        onChangeBalanceToMaintain: changeBalanceToMaintain,
        onChangeMaxFee: changeMaxFee,
        onChangeMaxPriceAbsolute: changeMaxPriceAbsolute,
        onChangeMaxPriceRelative: changeMaxPriceRelative,
        onChangeMaxPerBlock: changeMaxPerBlock,
        onUpdateTicketAutoBuyerConfig,
        currencyDisplay,
        pMaxFee:hcToAtoms(maxFee,currencyDisplay,UnitEnum.hc) 
      }}
      />,
      key: "output_0",
      style: {
        height: spring(300, {stiffness: 170, damping: 15}),
        opacity: spring(1, {stiffness: 100, damping: 20}),
      }
    }];
  }

  getNullStyles() {
    return [{
      data: <div></div>,
      key: "output_0",
      style: {
        height: spring(0, {stiffness: 100, damping: 14}),
        opacity: spring(0, {stiffness: 100, damping: 20}),
      }
    }];
  }

  render() {
    return (
      <TicketAutoBuyerForm
        {...{
          isTicketAutoBuyerConfigDirty: this.getIsDirty(),
          formatMessage: this.props.intl.formatMessage,
          ...this.props,
          ...this.state,
          ...substruct({
            onToggleShowDetails: null,
            onStartAutoBuyer: null,
            getNullStyles: null,
            getDetailsComponent: null,
          }, this)
        }}
      />
    );
  }

  getValueInAtoms(value) {
    const { currencyDisplay } = this.props;
    if (currencyDisplay.toLowerCase() === "hc")
      return value * 100000000;
    return value;
  }

  getCurrentSettings() {
   
    let obj=substruct({
      balanceToMaintain: null,
      maxFee: null,
      maxPriceAbsolute: null,
      maxPriceRelative: null,
      maxPerBlock: null
    }, this.props);

    obj = {...obj,...{
      maxFee:hcToAtoms(obj.maxFee,this.props.currencyDisplay,UnitEnum.hc),
      maxPriceAbsolute:hcToAtoms(obj.maxPriceAbsolute,this.props.currencyDisplay,UnitEnum.hc)
    }} 
    return obj;
  }

  getIsDirty() {
    const settings = this.getCurrentSettings();
    return !!Object.keys(settings).find(key => this.state[key] !== settings[key]);
  }

  getAccount() {
    const account = this.props.onChangeAccount ? this.props.account : this.state.account;
    return this.props.spendingAccounts.find(compose(eq(account.value), get("value")));
  }

  onToggleShowDetails() {
    this.state.isHidingDetails ? this.onShowDetails() : this.onHideDetails();
  }

  onShowDetails() {
    this.setState({ isHidingDetails: false, isScrollingDown: true });
  }

  onHideDetails() {
    this.setState({ isHidingDetails: true });
  }

  onChangeBalanceToMaintain(balanceToMaintain) {
    const balanceToMaintainInAtoms = this.getValueInAtoms(balanceToMaintain);

    const balanceToMaintainError = (
      isNaN(balanceToMaintainInAtoms) ||
      balanceToMaintainInAtoms < 0
    ) || !balanceToMaintain;

    this.setState({
      balanceToMaintain: balanceToMaintain.replace(/[^\d.]/g, ""),
      balanceToMaintainError: balanceToMaintainError
    });
  }

  onChangeMaxFee(maxFee) {  
    const maxFeeError = (isNaN(maxFee) || maxFee <= 0 || maxFee >= hcToAtoms(this.props.maxFee,this.props.currencyDisplay,UnitEnum.hc)) || !maxFee;
    this.setState({
      maxFee: maxFee.replace(/[^\d.]/g, ""),
      maxFeeError: maxFeeError
    });
  }

  onChangeMaxPriceAbsolute(maxPriceAbsolute) { 
    const maxPriceAbsoluteError = (isNaN(maxPriceAbsolute) || maxPriceAbsolute < 0) || !maxPriceAbsolute;
    this.setState({
      maxPriceAbsolute: maxPriceAbsolute.replace(/[^\d.]/g, ""),
      maxPriceAbsoluteError: maxPriceAbsoluteError
    });
  }

  onChangeMaxPriceRelative(maxPriceRelative) {
    const maxPriceRelativeError = (isNaN(maxPriceRelative) || maxPriceRelative < 0) || !maxPriceRelative;
    this.setState({
      maxPriceRelative: maxPriceRelative.replace(/[^\d.]/g, ""),
      maxPriceRelativeError: maxPriceRelativeError
    });
  }

  onChangeMaxPerBlock(maxPerBlock) {
    const maxPerBlockError = !maxPerBlock;
    this.setState({
      maxPerBlock: maxPerBlock.replace(/[^\d.]/g, ""),
      maxPerBlockError: maxPerBlockError
    });
  }

  onStartAutoBuyer(passphrase) {
    const { onEnableTicketAutoBuyer,currencyDisplay } = this.props;
    onEnableTicketAutoBuyer && onEnableTicketAutoBuyer(
      passphrase,
      this.getAccount().value,
      this.state.balanceToMaintain,
      atomsToHc(this.state.maxFee,currencyDisplay,UnitEnum.hc),
      atomsToHc(this.state.maxPriceAbsolute,currencyDisplay,UnitEnum.hc),
      this.state.maxPriceAbsolute,
      this.state.maxPerBlock,
      this.props.stakePool.value
    );
  }

  onUpdateTicketAutoBuyerConfig() {
    const { onUpdateTicketAutoBuyerConfig: onUpdateConfig } = this.props;
    this.getIsDirty() ? (onUpdateConfig && onUpdateConfig(
      this.getAccount().value,
      this.state.balanceToMaintain,
      atomsToHc(this.state.maxFee,this.props.currencyDisplay,UnitEnum.hc),
      atomsToHc(this.state.maxPriceAbsolute,this.props.currencyDisplay,UnitEnum.hc),
      this.state.maxPriceRelative,
      this.props.stakePool.value,
      this.state.maxPerBlock
    )) : null;
  }

  getErrors() {
    const { balanceToMaintainError, maxFeeError, maxPriceAbsoluteError, maxPriceRelativeError, maxPerBlockError } = this.state;

    if (balanceToMaintainError || maxFeeError || maxPriceAbsoluteError || maxPriceRelativeError || maxPerBlockError) {
      this.setState({
        canNotEnableAutobuyer: true
      });
      return true;
    }

    this.setState({
      canNotEnableAutobuyer: false
    });
    return false;
  }

}

export default ticketAutoBuyer(injectIntl(TicketAutoBuyer));
