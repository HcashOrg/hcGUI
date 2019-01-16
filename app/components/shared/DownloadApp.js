import { ConfirmModal } from "modals";
import { updateInformation, shutdownPage } from "connectors";
import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";

@autobind
class DownloadApp extends React.Component {
   constructor(props) {
      super(props);
      this.state = {
         show: true
      }
   }
   onCancelModal = () => {
      this.setState({
         show: false
      })
   }
   onSubmit = () => {
      shell.openExternal(this.props.downloadLink);
      this.props.cleanShutdown && this.props.cleanShutdown();
   }
   render() {
      return (
         this.props.hasUpdateApp ? <ConfirmModal
            modalTitle={<T id="downloadApp.tips" m="Tips"/>}
            show={this.state.show}
            onCancelModal={this.onCancelModal}
            onSubmit={this.onSubmit}
            modalContent={<T id="downloadApp.content" m="Is there a new version, is it updated to use?"/>}
         /> : null
      );
   }
}

export default shutdownPage(updateInformation(DownloadApp));
