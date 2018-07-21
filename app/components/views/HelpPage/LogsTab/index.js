import Logs from "./Page";
import {getHcdLogs, getHcwalletLogs, getHcguiLogs} from "wallet";
import {logging} from "connectors";

@autobind
class LogsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    let remoteHcd = false;
    if (this.props.getCredentials && this.props.getCredentials.rpc_host) {
      remoteHcd = true;
    }
    return {
      hcdLogs: null,
      hcwalletLogs: null,
      hcguiLogs: null,
      remoteHcd: remoteHcd,
    };
  }

  render() {
    const {showHcguiLogs, showHcdLogs, showHcwalletLogs,
      hideHcguiLogs, hideHcdLogs, hideHcwalletLogs
    } = this;
    const {
      hcdLogs, hcwalletLogs, hcguiLogs, remoteHcd
    } = this.state;
    return (
      <Logs
        {...{
          ...this.props, ...this.state }}
        {...{
          showHcguiLogs,
          showHcdLogs,
          showHcwalletLogs,
          hideHcguiLogs,
          hideHcdLogs,
          hideHcwalletLogs,
          hcdLogs,
          hcwalletLogs,
          hcguiLogs,
          remoteHcd }}
      />
    );
  }

  showHcguiLogs() {
    getHcguiLogs()
      .then(logs => {
        this.setState({hcguiLogs: Buffer.from(logs).toString("utf8")});
      })
      .catch(err => console.error(err));
  }

  hideHcguiLogs() {
    this.setState({hcguiLogs: null});
  }

  showHcdLogs() {
    getHcdLogs()
      .then(logs => {
        this.setState({hcdLogs: Buffer.from(logs).toString("utf8")});
      })
      .catch(err => console.error(err));
  }

  hideHcdLogs() {
    this.setState({hcdLogs: null});
  }

  showHcwalletLogs() {
    getHcwalletLogs()
      .then(logs => {
        this.setState({hcwalletLogs: Buffer.from(logs).toString("utf8")});
      })
      .catch(err => console.error(err));
  }

  hideHcwalletLogs() {
    this.setState({hcwalletLogs: null});
  }
}

export default logging(LogsTab);
