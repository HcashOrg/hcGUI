import { omniTradeDetail } from "connectors";
import { Screen } from "shared"; 
import { ConfirmModal } from "modals";
import { FormattedMessage as T } from "react-intl";

class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showConfirmModal: false,
        }
    }


    componentDidMount = () => {
        this.props.getTrade && this.props.getTrade(this.props.routeParams.txid); 
    }

    onLoadButtons = (trade) => {
        let buttons = [];
        if (trade && trade.status === "open" && trade.isMine) {
            buttons.push(<button key={trade.type_int} className="cancel-operation-btn" 
            onClick={() => { this.onShowModal(trade.sendingaddress, trade.propertyidforsale, trade.propertyiddesired) }}>
               <T id="omni.trade.detail.closeButton" m="Close Trade" />
            </button>)
        }

        return buttons;
    }

    onShowModal = (fromaddress, propertyidforsale, propertyiddesired) => {  
        this.setState({
            showConfirmModal: true,
            fromaddress,
            propertyidforsale,
            propertyiddesired
        })
    }

    onCancelModal = () => {
        this.setState({
            showConfirmModal: false
        })
    }

    onSubmit = () => {
        
        const { sendCancelTradesByPair, router } = this.props;
        const { fromaddress, propertyidforsale, propertyiddesired } = this.state; 
        sendCancelTradesByPair && sendCancelTradesByPair({ fromaddress, propertyidforsale, propertyiddesired }, router.goBack);
    }

    render() {
        const { trade, router } = this.props;
        const { showConfirmModal } = this.state;
        const dataKeys = trade ? Object.keys(trade) : [];
        return (
            <div className="tab-card">
                <Screen title={<T id="omni.history.detail.transaction" m="Check the transaction" />}>
                    <button className="send-operation-btn" onClick={() => { router.goBack() }}><T id="omni.history.detail.back" m="go back" /></button>
                    {this.onLoadButtons(trade)}
                </Screen>

                <div className="omni-history-list omni-history-detail">
                    <div className="omni-history-list-header">
                        <div><T id="omni.history.detail.fieldName" m="field name" /></div>
                        <div><T id="omni.history.detail.fieldContent" m="detailed information" /></div>
                    </div>
                    <div className="omni-history-list-body">
                        {
                            dataKeys.length > 0 ? dataKeys.map((item, index) => {
                                return <div key={index}>
                                    <div>{item}</div>
                                    <div>{(trade[item] instanceof Array) ? JSON.stringify(trade[item]) : trade[item].toString()}</div>
                                </div>
                            }) : null
                        }
                    </div>
                </div>

                <ConfirmModal
                    modalTitle={<T id="omni.confirmModal.cancelTradeModal" m="Cancel Trade" />}
                    show={showConfirmModal}
                    onCancelModal={this.onCancelModal}
                    onSubmit={this.onSubmit}
                    modalContent={<T id="omni.confirmModal.cancelTradeModalContent" m="Are you sure to cancel the transaction?" />}
                />
            </div>
        )
    }
}

export default omniTradeDetail(Index);