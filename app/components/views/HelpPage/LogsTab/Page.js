import { FormattedMessage as T } from "react-intl";

const Logs = ({
  showHcdLogs,
  showHcwalletLogs,
  hideHcdLogs,
  hideHcwalletLogs,
  hcdLogs,
  hcwalletLogs,
  remoteHcd,
  walletReady,
}
) => (
  <Aux>
    <div className="tab-card">
      {!remoteHcd ?
        !hcdLogs ?
          <div className="log-area-hidden" onClick={showHcdLogs}>
            <T id="help.logs.show.hcd" m="Show Hcd logs" />
          </div>:
          <div className="log-area-expanded">
            <div className="log-area-expanded-hide"  onClick={hideHcdLogs}>
              <T id="help.logs.hide.hcd" m="Hide Hcd logs" />
            </div>
            <div className="log-area-logs">
              <textarea rows="30" cols="95" value={hcdLogs} disabled />
            </div>
          </div> :
        <div/>
      }
      {!walletReady ? null : !hcwalletLogs ?
        <div className="log-area-hidden" onClick={showHcwalletLogs}>
          <T id="help.logs.show.hcwallet" m="Show Hcwallet logs" />
        </div>:
        <div className="log-area-expanded">
          <div className="log-area-expanded-hide"  onClick={hideHcwalletLogs}>
            <T id="help.logs.hide.hcwallet" m="Hide Hcwallet logs" />
          </div>
          <div className="log-area-logs">
            <textarea rows="30" cols="95" value={hcwalletLogs} disabled />
          </div>
        </div>
      }
    </div>
  </Aux>
);

export default Logs;
