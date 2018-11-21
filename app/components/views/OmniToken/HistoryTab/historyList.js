import Screen from './screen';
import HistoryTable from './historyTable';

const HistoryList = ({onProperyidToName,selectAddress,addressList,onAddressChanged,listTransactions,onDetail})=>(
    <div>
        <Screen {...{
                addressList,
                onAddressChanged,
                selectAddress
            }}/>
            <HistoryTable {
                ...{
                    onProperyidToName,
                    listTransactions,
                    onDetail
                }
            }/>
    </div>
)

export default HistoryList;