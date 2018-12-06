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

        const { walletAssetsBalances,getCrowdsale,routeParams } = this.props;
        getCrowdsale && getCrowdsale(routeParams.propertyid).then(result=>{ 
            const assets = walletAssetsBalances ? walletAssetsBalances.find(item => item.propertyid === result.propertyiddesired) : null;
            if (assets) {
                this.setState({ hasButton: true });
            }
    
          
            const toTime = parseInt(new Date().getTime() / 1000);
            const diffTime = result.deadline - toTime;
    
            if (diffTime <= 0) {
                this.setState({ Expired: true }); 
                return;
            }else{
                this.timer = setInterval(this.getDeadline(result.deadline), 1000);
            }
    
        })
       
        

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
            this.setState({ Expired: true }); 
            clearInterval(this.timer);
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.timer);
    }

    render() {
        const { isTestNet, router, crowdsale } = this.props;
    
        const { days, hours, minutes, seconds, Expired } = this.state;
        return (<div>{crowdsale ? <div className="omni-asstes-details omni-crowdsale-details">
            <Card title={<div>{crowdsale.name} <span>(#{crowdsale.propertyid})</span></div>}>
                <div className="omni-asstes-details-Basics">


                    <div>
                        <T id="omni.assets.infoForm.issueAddress" m="Issue address" />:<a className="stakepool-link" onClick={function (x) { shell.openExternal(x); }.bind(null, `https://${isTestNet ? "testnet-" : ""}hcomni-explorer.h.cash/address/${crowdsale.issuer}`)}> {crowdsale.issuer}</a>
                    </div>
                    <div>
                        <T id="omni.crodsale.infoForm.assets" m="Supported Assets" />:{`${crowdsale.assetsName}(${crowdsale.propertyiddesired}) / Rate(${crowdsale.tokensperunit})`}
                    </div>
                </div>
                
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
                        {crowdsale.amountraised}
                    </div>
                </div>
                <div className="row">
                    <div>
                        <T id="omni.crodsale.infoForm.tokensissued" m="Token that has been created" />
                    </div>
                    <div>
                        {crowdsale.tokensissued}
                    </div>
                </div>
                <div className="row">
                    <div>

                        <T id="omni.crodsale.infoForm.earlybonus" m="Current early participation in crowdfunding offers" />
                    </div>
                    <div>

                        {crowdsale.earlybonus}
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
                                pathname: `/omni/crowdsales/manage/${crowdsale.propertyid}`,
                                query: { item: JSON.stringify(crowdsale) }
                            })
                        }}>
                        <T id="omni.crodsale.infoForm.buttonText" m="participate" />
                    </KeyBlueButton>

                </div>
            </Card>} 
        </div> : null}
        </div>
        );
    }
}


export default omniCrowdsaleManageForm(Index);