import ViewPage from "./page";
import InfiniteScroll from "react-infinite-scroller";
import { omniTradeList } from "connectors";
import { LoadingMoreTransactionsIndicator, NoMoreTransactionsIndicator } from "indicators";



class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            walletAddress: null,
            walletAddressList: null,
            indexPage: 1
        }
    }

    componentDidMount = () => {
        const { walletAddressBalances } = this.props;
        if (walletAddressBalances && walletAddressBalances.length > 0) {

            this.setState({
                walletAddressList: walletAddressBalances.map(item => {
                    return {
                        text: item.address,
                        value: item.address,
                    }
                }),
                walletAddress: walletAddressBalances[0].address
            });
            this.getTradeHistoryForAddress(walletAddressBalances[0].address, true, this.state.indexPage);
        }
    }

    onAddressChanged = (value) => {
        if (this.state.walletAddress != value) {
            this.setState({ walletAddress: value });
            this.getTradeHistoryForAddress(value, true, 1);
        }
    }
    getTradeHistoryForAddress = (address, reset, indexPage) => {
        const { getTradeHistoryForAddress } = this.props;

        getTradeHistoryForAddress && getTradeHistoryForAddress(address, reset, indexPage, ({ indexPage }) => {
            this.setState({ indexPage })
        })
    }

    onSend = () => {
        this.props.router.push("omni/trade/tradeSend");
    }

    onDetail = (txid) => {
        this.props.router.push("/omni/trade/detail/" + txid);
    }

    onLoadMoreTrade = () => {
        if (this.state.walletAddress) {
            this.getTradeHistoryForAddress(this.state.walletAddress, false, this.state.indexPage);
        }
    }
    render() {
        const { tradeHistory, noMoreTradeHistory } = this.props;
        const { walletAddressList, walletAddress } = this.state;
        const loadMoreThreshold = 90 + Math.max(0, this.props.window.innerHeight - 765);
        return (
            <InfiniteScroll
                hasMore={!noMoreTradeHistory}
                loadMore={this.onLoadMoreTrade}
                initialLoad={loadMoreThreshold > 90}
                useWindow={false}
                threshold={loadMoreThreshold}
            >
                <div className="tab-card">
                    <ViewPage
                        {
                        ...{
                            walletAddressList: walletAddressList ? walletAddressList : [],
                            onAddressChanged: this.onAddressChanged,
                            walletAddress: walletAddress,

                            tradeHistory,
                            onSend: this.onSend,

                            onDetail: this.onDetail
                        }
                        }
                    />

                    {(!noMoreTradeHistory && walletAddressList) ? <LoadingMoreTransactionsIndicator />
                        : <NoMoreTransactionsIndicator />}
                </div>
            </InfiniteScroll>
        )
    }
}

export default omniTradeList(Index);