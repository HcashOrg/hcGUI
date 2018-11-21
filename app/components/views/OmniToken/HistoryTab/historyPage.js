
import { omniHistory } from "connectors";
import HistoryList from './HistoryList';
import { LoadingMoreTransactionsIndicator, NoMoreTransactionsIndicator } from "indicators";
import InfiniteScroll from "react-infinite-scroller";

const optionAll={
    text: "all",
    value: "*",
}

class HistoryPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            selectAddress:optionAll.value,
            indexPage: 0
        }
    } 

    componentDidMount=()=>{
        this.getListtransactions("*",this.state.indexPage)
    }

    getListtransactions=(txid,indexPage)=>{ 
        this.props.getListtransactions({
            txid,indexPage, callBack: (backData) => {
                this.setState({ indexPage: backData.indexPage })
            }
        });
    }

 
    onAddressChanged = (address) => { 
        this.setState({ selectAddress: address });
        this.getListtransactions(address,0);
    }

    onDetail = (txHash) => { 
        this.props.router.push("/omni/history/" + txHash);
    }

    onLoadMoreTransactions = () => {
        this.getListtransactions(this.state.selectAddress,this.state.indexPage);
    }

    onProperyidToName = (properyid) => {
        if (properyid) { 
            const { listproperties } = this.props; 
            const obj = listproperties.find(item => {
                return item.propertyid == properyid
            }) 
            return obj?obj.name:"--";
        } else {
            return "--";
        }

    }

    render() {
        const { walletAddressBalances, listTransactions, noMoreTransactions } = this.props;
        const { selectAddress } = this.state;
        const addressList =walletAddressBalances? walletAddressBalances.map(item => {
            return {
                text: item.address,
                value: item.address,
            }
        }):[]

        const loadMoreThreshold = 90 + Math.max(0, this.props.window.innerHeight - 765);
        return (
            <InfiniteScroll
                hasMore={!noMoreTransactions}
                loadMore={this.onLoadMoreTransactions}
                initialLoad={loadMoreThreshold > 90}
                useWindow={false}
                threshold={loadMoreThreshold}
            >
                <div className="tab-card">
                    <HistoryList
                        {
                        ...{
                            onProperyidToName: this.onProperyidToName,
                            addressList:[...[optionAll],...addressList],
                            onAddressChanged: this.onAddressChanged,
                            selectAddress:selectAddress==optionAll.value?optionAll.text:selectAddress,
                            listTransactions,
                            onDetail: this.onDetail
                        }
                        }
                    />

                    {!noMoreTransactions ? <LoadingMoreTransactionsIndicator />
                        : <NoMoreTransactionsIndicator />}
                </div>

            </InfiniteScroll>
        );
    }
}
export default omniHistory(HistoryPage);