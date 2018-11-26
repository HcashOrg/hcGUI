import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";
import Card from "card";
import {KeyBlueButton} from "buttons";  
import "style/omniAssetsDetails.less";

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    

    render() {
        const {isTestNet, router ,location:{query}} = this.props;
        return (<div>{query ? <div className="omni-asstes-details">
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
                <div className="hc-card-buttons">
                    <KeyBlueButton
                        size="large"
                        className="hc-card-buttons-exit"
                        onClick={() => {
                            router.goBack()
                        }}
                        block={false} >
                        <T id="formButton.quit" m="Quit" />
                    </KeyBlueButton>
                </div>
            </Card>
            {/* <Card title="Asset History">
                <div className="omni-asstes-details-history">
                    <div>
                        <div>
                            <div>3 几天前</div>
                            <div>T1104153701 被创建</div>

                        </div>
                        <div>Nov 04, 2018 (03:43PM)</div>
                    </div> 
                </div>
            </Card> */}
        </div> : null}
        </div>
        );
    }
}


export default Index;