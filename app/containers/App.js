import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { IntlProvider } from "react-intl";
import MUItheme from "materialUITheme";
import { defaultFormats } from "i18n/locales";
import app from "connectors/app";
import SideBar from "components/SideBar";
import Snackbar from "components/Snackbar";
import { RouteTransition } from "shared";
import { getPage } from "helpers";
import theme from "theme";
import "style/Layout.less";

const fade = { atEnter: { opacity: 0 }, atActive: { opacity: 1 }, atLeave: { opacity: 0 }};

const wrapperComponent = props => <div className="page-view" { ...props } />;

@autobind
class App extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    locale: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired,
    shutdownApp: PropTypes.func.isRequired,
    shutdownRequested: PropTypes.bool.isRequired,
    daemonStopped: PropTypes.bool.isRequired,
  };

  state = {
    showAlphaMessage: true,
  };

  constructor (props) {
    super(props);
    const { window } = props;
    window.addEventListener("beforeunload", this.beforeWindowUnload);
    this.refreshing = false;

    props.listenForAppReloadRequest(this.onReloadRequested);
  }

  dismissAlphaMessage () {
      this.setState({ showAlphaMessage: false });
  }

  componentWillUnmount () {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  }

  beforeWindowUnload(event) {
    if (this.refreshing) {
      return;
    }

    const { shutdownRequested, daemonStopped } = this.props;
    if (!daemonStopped) {
      event.preventDefault();
      event.returnValue = false;
    }

    if (!shutdownRequested) {
      this.props.shutdownApp();
    }
  }

  onReloadRequested(event) {
    this.refreshing = true;
    event.sender.send("app-reload-ui");
  }

  render() {
    const { locale, routes, children } = this.props;
    const pathname = getPage(routes);

    const alphaMessageView = this.state.showAlphaMessage?
        <div style={{
            padding: '20px',
            margin: '20px',
            backgroundColor: '#862ee0',
            borderRadius: '10px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '20px',
            position: 'absolute',
            width: '100%',
            top: '0',
            right: '0',
            width: 'calc(100% - 140px)',
            zIndex: '99999',
        }}>
            <div style={{ flex: '1 1 100%'  }}>
                This product is in , have a feature idea? &nbsp;&nbsp;&nbsp;&nbsp;Email it to features@h.cash.
            </div>
            <div style={{ flex: '0 0 50px' }}>
                <button
                    style={{ border: '0', color: '#fff', backgroundColor: 'transparent', cursor: 'pointer' }}
                    onClick={this.dismissAlphaMessage}
                >
                    Dismiss
                </button>
            </div>
        </div>: null;

    return (
      <MuiThemeProvider muiTheme={MUItheme}>
        <IntlProvider
          locale={locale.language}
          messages={locale.messages}
          formats={locale.formats}
          defaultFormats={defaultFormats}
          key={locale.key}>
          <div className="page-body">
            <SideBar />
            <Snackbar />
            <RouteTransition className="page-container" opts={ theme("springs.page") } {...{ wrapperComponent, pathname, ...fade }}>
              { children }
            </RouteTransition>
          </div>
        </IntlProvider>
      </MuiThemeProvider>
    );
  }
}

export default app(App);
