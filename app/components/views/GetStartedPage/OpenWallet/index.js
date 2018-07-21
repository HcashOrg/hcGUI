import { OpenWalletDecryptFormHeader, OpenWalletDecryptFormBody } from "./DecryptForm";
import { OpenWalletCreateFormHeader, OpenWalletCreateFormBody } from "./CreateForm";

@autobind
class OpenWalletHeader extends React.Component {
  render() {
    const { hasExistingWallet } = this.props;
    const { onToggleNewExisting } = this;

    return hasExistingWallet ? (
      <OpenWalletDecryptFormHeader
        {...{
          ...this.props
        }}
      />
    ) : (
      <OpenWalletCreateFormHeader
        {...{
          ...this.props,
          onToggleNewExisting
        }}
      />
    );
  }

  onToggleNewExisting(side) {
    if (side == "right") {
      this.props.onSetCreateWalletFromExisting(true);
    } else if (side == "left") {
      this.props.onSetCreateWalletFromExisting(false);
    }
  }
}

@autobind
class OpenWalletBody extends React.Component {
  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.resetState();
  }

  getInitialState() {
    return {
      publicPassPhrase: "",
      privatePassPhrase: "",
      hasAttemptedOpen: false
    };
  }

  render() {
    const { publicPassPhrase, privatePassPhrase, hasAttemptedOpen } = this.state;
    const { hasExistingWallet } = this.props;
    const {
      onSetPublicPassPhrase,
      onSetPrivatePassPhrase,
      onOpenWallet,
      onKeyDown,
    } = this;

    return hasExistingWallet ? (
      <OpenWalletDecryptFormBody
        {...{
          ...this.props,
          publicPassPhrase,
          privatePassPhrase,
          hasAttemptedOpen,
          onSetPublicPassPhrase,
          onSetPrivatePassPhrase,
          onOpenWallet,
          onKeyDown
        }}
      />
    ) : (
      <OpenWalletCreateFormBody
        {...{
          ...this.props
        }}
      />
    );
  }

  resetState() {
    this.setState(this.getInitialState());
  }

  onSetPublicPassPhrase(publicPassPhrase) {
    this.setState({ publicPassPhrase });
  }

  onSetPrivatePassPhrase(privatePassPhrase) {
    this.setState({ privatePassPhrase });
  }

  onOpenWallet() {
    /// TODO: determine if this can be removed or needs to stay?
    // if (!this.state.publicPassPhrase) {
    //   return this.setState({ hasAttemptedOpen: true });
    // }

    this.props.onOpenWallet(this.state.publicPassPhrase, this.state.privatePassPhrase, true);
    this.resetState();
  }

  onKeyDown(e) {
    if(e.keyCode == 13) {     // Enter key
      e.preventDefault();
      this.onOpenWallet();
    }
  }

}

export { OpenWalletHeader, OpenWalletBody };
