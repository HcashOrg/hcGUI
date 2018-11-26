import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";
import Card from "card";
import { KeyBlueButton } from "buttons";
import "style/omniAssetsDetails.less";

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        const { isTestNet, router, location: { query } } = this.props;
        return (<div>{query ? <div className="omni-asstes-details omni-crowdsale-details">
            <Card title={<div>{query.name} <span>(#{query.propertyid})</span></div>}>
                <div className="omni-asstes-details-Basics">
                    <div>
                        {query.data}
                    </div>
                    <div><T id="omni.assets.details.visitUrl" m="For more information please visit:" />
                        <a className="stakepool-link" onClick={function (x) { shell.openExternal(x); }.bind(null, query.url)}> {query.url}</a>
                    </div>

                    <div>
                        <T id="omni.assets.infoForm.issueAddress" m="Issue address" />:<a className="stakepool-link" onClick={function (x) { shell.openExternal(x); }.bind(null, `https://${isTestNet ? "testnet-" : ""}hcomni-explorer.h.cash/address/${query.issuer}`)}> {query.issuer}</a>
                    </div>
                </div>
            </Card>
            <Card>
                <div className="omni-crowdsale-countdown">
                    <div className="crowdsale-title">
                        <p>
                            正在进行的众筹
                        </p>
                        <p>
                            最后期限:
                        </p>
                    </div>

                    <div className="timerWrapper">
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                年S
                                </div>

                        </div>
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                月S
                                </div>

                        </div>
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                日S
                                </div>

                        </div>
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                时S
                                </div>
                        </div>
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                分S
                                </div>
                        </div>
                        <div className="countdown-group">
                            <div>
                                25
                                </div>
                            <div>
                                秒S
                                </div>
                        </div>
                    </div>

                </div>
            </Card>

            {/* <div className="hc-card-buttons">
                    <KeyBlueButton
                        size="large"
                        className="hc-card-buttons-exit"
                        onClick={() => {
                            router.goBack()
                        }}
                        block={false} >
                        <T id="formButton.quit" m="Quit" />
                    </KeyBlueButton>
                </div> */}
        </div> : null}
        </div>
        );
    }
}


export default Index;