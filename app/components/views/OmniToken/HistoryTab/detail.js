
import { omniHistory } from "connectors";
import Screen from 'shared/screen';
import { FormattedMessage as T } from "react-intl";

class Detail extends React.PureComponent {
    constructor(props) {
        super(props);
    }


    componentDidMount = () => {
        this.props.gettransaction(this.props.routeParams.txid)
    }

    render() {
        const { omniTransaction, router } = this.props;
        const dataKeys=omniTransaction?Object.keys(omniTransaction):[]; 
        return (
            <div className="tab-card">
                <Screen title={<T id="omni.history.detail.transaction" m="Check the transaction"/>}>
                    <button className="send-operation-btn" onClick={() => { router.goBack() }}><T id="omni.history.detail.back" m="go back"/></button>
                </Screen>

                <div className="omni-history-list omni-history-detail">
                    <div className="omni-history-list-header">
                        <div><T id="omni.history.detail.fieldName" m="field name"/></div>
                        <div><T id="omni.history.detail.fieldContent" m="detailed information"/></div>
                    </div>
                    <div className="omni-history-list-body">
                        {
                            dataKeys.length>0 ? dataKeys.map(item => {
                                return <div>
                                    <div>{item}</div>
                                    <div>{(omniTransaction[item] instanceof Array)?JSON.stringify(omniTransaction[item]):omniTransaction[item]}</div>
                                </div>
                            }) : null
                        } 
                    </div>
                </div>
            </div>
        )
    }
}

export default omniHistory(Detail);