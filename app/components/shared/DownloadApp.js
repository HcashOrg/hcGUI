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
            modalTitle={<T id="downloadApp.tips" m="Update is available:" />}
            show={this.state.show}
            onCancelModal={this.onCancelModal}
            onSubmit={this.onSubmit}
            confirmLabel={<T id="downloadApp.confirmLabel" m="Confirm update" />}
            modalContent={
               <div className="confirmAssetsModal-content">
                  <div>
                     <T id="downloadApp.content" m="An update to the newest version is available. Do you want to upgrade 'hcGUI' to the latest version?" />
                  </div>
                  <div>
                     <div><T id="downloadApp.content.Version" m="Version：" /></div>
                     <div>{lastVersion} </div>
                  </div>
                  <div>
                     <div><T id="downloadApp.content.updateContent" m="New features:" /></div>
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
