
import { tsToDate } from "helpers";
import { FormattedMessage as T } from "react-intl";

const historyTable = ({ tradeHistory, onDetail }) => (

    <div className="omni-history-list">
        <div className="omni-history-list-header">
            <div> 
                <T id="omni.trade.form.Field.status" m="Status"/>
            </div>
            <div>
            <T id="omni.trade.form.Field.assets" m="Asstes Name"/>
            </div>

            <div>
            <T id="omni.trade.form.Field.forsaleAmount" m="Forsale Amount"/>
            </div>
            <div>
            <T id="omni.trade.form.Field.desiredAssets" m="Desired Assets" />
            </div>

            <div>
            <T id="omni.trade.form.Field.desiredAmount" m="Desired Amount"/>
           
            </div>
            <div><T id="omni.trade.form.Field.blockTime" m="blockTime"/></div>
        </div>
        <div className="omni-history-list-body">
            {
                tradeHistory && tradeHistory.length > 0 ? tradeHistory.map(item => {
                    return <div key={item.txid} onClick={() => {
                        onDetail(item.txid);
                    }}>

                        <div>
                            {item.status}
                        </div>
                        <div>{item.propertyidforsaleName}</div>
                        <div> {item.amountforsale}</div>
                        <div> {item.propertyiddesiredName}</div>
                        <div>{item.amountdesired}</div>
                        <div>
                            <div>
                                <T id="transaction.timestamp"
                                    m="{timestamp, date, medium} {timestamp, time, medium}"
                                    values={{ timestamp: tsToDate(item.blocktime) }} /></div>
                        </div>
                    </div>

                }) : null
            }


        </div>
    </div>
);

export default historyTable;