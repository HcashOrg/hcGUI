
import { tsToDate } from "helpers";
import { FormattedMessage as T } from "react-intl";

const historyTable = ({ onProperyidToName, listTransactions, onDetail }) => (

    <div className="omni-history-list">
        <div className="omni-history-list-header">
            <div>
            <T id="omni.history.type"
                        m="type"/>
            </div>
            <div><T id="omni.history.amount"
                        m="amount"/></div>
            <div><T id="omni.history.currency"
                        m="name"/></div>
            {/* <div>交易明细</div> */}
            <div><T id="omni.history.blockTime"
                        m="blockTime"/></div>
        </div>
        <div className="omni-history-list-body">
            {listTransactions && listTransactions.length > 0 ? listTransactions.map((item) => <div key={item.txid} onClick={() => {
                onDetail(item.txid);
            }}>
                <div>{item.type}</div>
                <div>{item.amount ? item.amount : '--'}</div>
                <div>{onProperyidToName(item.propertyid)}</div>
                {/* <div>交易明细</div> */}
                <div>
                    <T id="transaction.timestamp"
                        m="{timestamp, date, medium} {timestamp, time, medium}"
                        values={{ timestamp: tsToDate(item.blocktime) }} /></div>
            </div>) : null
            }

        </div>
    </div>
);

export default historyTable;