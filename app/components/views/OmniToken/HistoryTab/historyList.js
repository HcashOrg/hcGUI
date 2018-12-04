import Screen from './screen';
import HistoryTable from './historyTable';

const HistoryList = ({selectAddress,addressList,onAddressChanged,listTransactions,onDetail})=>(
    <div>
        <Screen {...{
                addressList,
                onAddressChanged,
                selectAddress
            }}/>
            <HistoryTable {
                ...{
                   
                    listTransactions,
                    onDetail
                }
            }/>
    </div>
)

export default HistoryList;