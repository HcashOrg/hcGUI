import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, NetworkSwitch } from "buttons";
import "style/LoginForm.less";

const messages = defineMessages({
  messageWalletNamePlaceholder: {
    id: "login.form.rpcuser.placeholder",
    defaultMessage: "Enter your wallet name here",
  },
});

const CreateWalletForm = ({
  createWallet,
  newWalletName,
  newWalletNetwork,
  onChangeCreateWalletName,
  onChangeCreateWalletNetwork,
  onChangeCreateWalletOpenOmni,
  enableomni,
  intl
}) => {
  return (
    <Aux>
      <div className="advanced-daemon-row advanced-daemon-row--with-flex">
        <div className=" dvanced-daemon-column advanced-daemon-column--30p"
          style={{
            paddingBottom: '28px', // to push label up to match input box.
            fontSize: '16px', // match the mainnet/testnet text
          }}
        >
          <T id="advanced.remote.rpcuser" m="Name" />:
        </div>
        <div className="advanced-daemon-column advanced-daemon-column--70p">
          <TextInput
            type="text"
            required
            value={newWalletName}
            onChange={(e) => onChangeCreateWalletName(e.target.value)}
            placeholder={intl.formatMessage(messages.messageWalletNamePlaceholder)}
            showErrors
          />
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div className="advanced-daemon-row advanced-daemon-row--with-flex">
          <div className="dvanced-daemon-column advanced-daemon-column--30p">
            <span className="advanced-daemon-network">{newWalletNetwork}</span>
          </div>
          <div className="advanced-daemon-column advanced-daemon-column--70p">
            <NetworkSwitch
              enabled={newWalletNetwork !== "testnet"}
              onClick={onChangeCreateWalletNetwork}
            />
          </div>
        </div>
        <div className="advanced-daemon-row advanced-daemon-row--with-flex">
          <div className="dvanced-daemon-column advanced-daemon-column--30p">
            <span className="advanced-daemon-network">{!enableomni ? "关闭OMNI" : "开启OMNI"}</span>
          </div>
          <div className="advanced-daemon-column advanced-daemon-column--70p">
            <NetworkSwitch
              enabled={!enableomni}
              onClick={onChangeCreateWalletOpenOmni}
            />
          </div>
        </div>
      </div>
      <div className="advanced-daemon-row advanced-daemon-row--with-flex advanced-daemon-row--with-padding-top">
        <KeyBlueButton onClick={createWallet}>
          <T id="wallet.create.button" m="Create new wallet" />
        </KeyBlueButton>
      </div>
    </Aux>
  );
};

export default CreateWalletForm;
