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
      const { hasUpdateApp,lastVersion, releaseBody,getDataConfigAttempt } = this.props; 
      return (
         (hasUpdateApp && !getDataConfigAttempt) ? <ConfirmModal
            modalTitle={<T id="downloadApp.tips" m="Tips" />}
            show={this.state.show}
            onCancelModal={this.onCancelModal}
            onSubmit={this.onSubmit}
            modalContent={
               <div className="confirmAssetsModal-content">
                  <div>
                     <T id="downloadApp.content" m="Is there a new version, is it updated to use?" />
                  </div>
                  <div>
                     <div><T id="downloadApp.content.Version" m="Version：" /></div>
                     <div>{lastVersion} </div>
                  </div>
                  <div>
                     <div><T id="downloadApp.content.updateContent" m="Update Content：" /></div>
                     <div dangerouslySetInnerHTML={{
                        __html: releaseBody ? releaseBody.replace(/\r\n/g, "<br/>") : ""
                     }} />
                  </div>

               </div>
            }
         /> : null
      );
   }
}

export default shutdownPage(updateInformation(DownloadApp));
