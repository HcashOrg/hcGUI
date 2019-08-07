import {
  WalletSelectionFormHeader as WalletSelectionHeader,
  WalletSelectionFormBody
} from "./Form";
import DownloadApp from "../../../shared/DownloadApp";

@autobind
class WalletSelectionBody extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      newWalletName: "",
      newWalletNetwork: "mainnet",
      sideActive: false,
      enableomni:false,
      selectedWallet: this.props.availableWallets ? this.props.availableWallets[0] : null
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.availableWallets && this.props.availableWallets.length !== nextProps.availableWallets.length) {
      this.setState({ selectedWallet: nextProps.availableWallets[0] });
    }
  }

  componentWillUnmount() {
    this.resetState();
  }

  render() {
    const {
      onChangeAvailableWallets,
      startWallet,
      createWallet,
      onShowCreateWallet,
      onShowSelectWallet,
      onChangeCreateWalletName,
      onChangeCreateWalletNetwork,
      onChangeCreateWalletOpenOmni
    } = this;
    const {
      selectedWallet,
      sideActive,
      newWalletName,
      newWalletNetwork,
    } = this.state;
    return (
      [<WalletSelectionFormBody
        {...{
          sideActive,
          onShowCreateWallet,
          onShowSelectWallet,
          onChangeAvailableWallets,
          onChangeCreateWalletName,
          onChangeCreateWalletNetwork,
          onChangeCreateWalletOpenOmni,
          startWallet,
          createWallet,
          selectedWallet,
          newWalletName,
          newWalletNetwork,
          ...this.props,
          ...this.state,
        }}
        key="w01"
      />,<DownloadApp key="d02"/>]
    );
  }
  onShowCreateWallet() {
    this.setState({ sideActive: false });
  }
  onShowSelectWallet() {
    this.setState({ sideActive: true });
  }
  onChangeAvailableWallets(selectedWallet) {
    this.setState({ selectedWallet });
  }
  onChangeCreateWalletName(newWalletName) {
    if ( newWalletName && newWalletName.length > 20) {
      return
    }
    this.setState({ newWalletName });
  }
  onChangeCreateWalletNetwork() {
    const { newWalletNetwork } = this.state;
    var updatedNetwork = newWalletNetwork;
    if (newWalletNetwork == "mainnet") {
      updatedNetwork = "testnet";
    } else if (newWalletNetwork == "testnet") {
      updatedNetwork = "mainnet";
    }
    this.setState({ newWalletNetwork: updatedNetwork });
  }

  onChangeCreateWalletOpenOmni(){
    const { enableomni } = this.state;
    this.setState({ enableomni: !enableomni });
  }

  createWallet() {
    const { newWalletName, newWalletNetwork,enableomni } = this.state;
    if (newWalletName == "" || (newWalletNetwork !== "mainnet" && newWalletNetwork !== "testnet")) {
      return;
    } 
    this.props.onCreateWallet({
      label: newWalletName + " (" + newWalletNetwork + ")",
      network: newWalletNetwork,
      enableomni:enableomni,
      value: {wallet: newWalletName, network: newWalletNetwork
      }});
  }
  startWallet() {
    this.props.onStartWallet(this.state.selectedWallet);
  }
  resetState() {
    this.setState(this.getInitialState());
  }

}

export { WalletSelectionHeader, WalletSelectionBody};
