import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";
import Card from "card";
import { KeyBlueButton } from "buttons";
import { omniCrowdsaleManageForm } from "connectors";

import "style/omniAssetsDetails.less";

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            years: 0,
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            hasButton: false,
            Expired: false

        }
    }
    componentDidMount = () => {

        const { location: { query }, walletAssetsBalances } = this.props;
        const obj = JSON.parse(query.item);
        const assets = walletAssetsBalances ? walletAssetsBalances.find(item => item.propertyid === obj.propertyiddesired) : null;
        if (assets) {
            this.setState({ hasButton: true });
        }

      
        const toTime = parseInt(new Date().getTime() / 1000);
        const diffTime = obj.deadline - toTime;

        if (diffTime <= 0) {
            this.setState({ Expired: true }); 
            return;
        }else{
            this.timer = setInterval(this.getDeadline(obj.deadline), 1000);
        }

        

    }

    getDeadline = (deadline)=>() => {
       
        const toTime = parseInt(new Date().getTime() / 1000);
        const diffTime = deadline - toTime;

        const days = parseInt(diffTime / 86400);
        const re_days = diffTime % 86400;
        const hours = parseInt(re_days / 3600);
        const re_hours = re_days % 3600;
        const minutes = parseInt(re_hours / 60);
        const seconds = re_hours % 60;

        this.setState({
            days, hours, minutes, seconds
        })
        if (diffTime <= 0) {
            clearInterval(this.timer);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    render() {
        const { isTestNet, router, location: { query } } = this.props;
        const item = JSON.parse(query.item);
        const { days, hours, minutes, seconds, Expired } = this.state;
        return (<div>{item ? <div className="omni-asstes-details omni-crowdsale-details">
            <Card title={<div>{item.name} <span>(#{item.propertyid})</span></div>}>
                <div className="omni-asstes-details-Basics">


                    <div>
                        <T id="omni.assets.infoForm.issueAddress" m="Issue address" />:<a className="stakepool-link" onClick={function (x) { shell.openExternal(x); }.bind(null, `https://${isTestNet ? "testnet-" : ""}hcomni-explorer.h.cash/address/${item.detail.issuer}`)}> {item.detail.issuer}</a>
                    </div>
                    <div>
                        <T id="omni.crodsale.infoForm.assets" m="Supported Assets" />:{`${item.assetsName}(${item.propertyiddesired}) / Rate(${item.tokensperunit})`}
                    </div>
                </div>
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
            </Card>
            {Expired ? null : <Card className="omni-crowdsale-rightPanle">
                <div className="omni-crowdsale-countdown">
                    <div className="crowdsale-title">
                        <p>

                            <T id="omni.crodsale.infoForm.tips" m="Ongoing crowdfunding" />
                        </p>
                        <p>
                            <T id="omni.crodsale.infoForm.Deadline" m="Deadline" />:
                        </p>
                    </div>

                    <div className="timerWrapper">
                        {/* <div className="countdown-group">
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
                        </div> */}
                        <div className="countdown-group">
                            <div>
                                {days < 10 ? `0${days}` : days}
                            </div>
                            <div>
                                <T id="omni.crodsale.infoForm.days" m="Days" />
                            </div>

                        </div>
                        <div className="countdown-group">
                            <div>
                                {hours < 10 ? `0${hours}` : hours}
                            </div>
                            <div>
                                <T id="omni.crodsale.infoForm.Hours" m="Hours" />
                            </div>
                        </div>
                        <div className="countdown-group">
                            <div>
                                {minutes < 10 ? `0${minutes}` : minutes}
                            </div>
                            <div>
                                <T id="omni.crodsale.infoForm.Minutes" m="Minutes" />
                            </div>
                        </div>
                        <div className="countdown-group">
                            <div>
                                {seconds < 10 ? `0${seconds}` : seconds}
                            </div>
                            <div>
                                <T id="omni.crodsale.infoForm.Seconds" m="Seconds" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div>

                        <T id="omni.crodsale.infoForm.amountraised" m="Token that has been purchased" />
                    </div>
                    <div>
                        {item.detail.amountraised}
                    </div>
                </div>
                <div className="row">
                    <div>
                        <T id="omni.crodsale.infoForm.tokensissued" m="Token that has been created" />
                    </div>
                    <div>
                        {item.detail.tokensissued}
                    </div>
                </div>
                <div className="row">
                    <div>

                        <T id="omni.crodsale.infoForm.earlybonus" m="Current early participation in crowdfunding offers" />
                    </div>
                    <div>

                        {item.detail.earlybonus}
                    </div>
                </div>
                <div className="buttonPanel">
                    <div>
                        <T id="omni.crodsale.infoForm.panelTips" m="Get the token!" />
                    </div>
                    <KeyBlueButton
                        disabled={!this.state.hasButton}
                        size="large"
                        className="hc-card-buttons-exit"
                        block={false}
                        onClick={() => {
                            router.push({
                                pathname: `/omni/crowdsales/manage/${item.propertyid}`,
                                query: { item: JSON.stringify(item) }
                            })
                        }}>
                        <T id="omni.crodsale.infoForm.buttonText" m="participate" />
                    </KeyBlueButton>

                </div>
            </Card>}

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


export default omniCrowdsaleManageForm(Index);