import { tsToDate } from "helpers";
import { FormattedMessage as T } from "react-intl";

const CrowdsaleList = ({ activeCrowdsales,router }) => (

    <div className="omni-history-list">
        <div className="omni-history-list-header">
            <div>
                众筹
            </div>
            <div>
                支持的货币
            </div>
            <div>
                最后期限
        </div>
            <div>
                已被购买的令牌
        </div>
            <div>
                已被创建的令牌
            </div>
        </div>
        <div className="omni-history-list-body">

            {
                activeCrowdsales ? activeCrowdsales.map(item => {
                    return <div key={item.propertyid} onClick={() => {
                        router.push({
                            pathname: `/omni/crowdsales/details/${item.propertyid}`,
                            query: item.detail
                        })
                    }}>
                        <div>{item.name}</div>
                        <div>{`${item.assetsName}(${item.propertyiddesired}) / Rate(${item.tokensperunit})`}</div>
                        <div><T id="transaction.timestamp"
                            m="{timestamp, date, medium} {timestamp, time, medium}"
                            values={{ timestamp: tsToDate(item.deadline) }} /></div>
                        <div>{item.detail.amountraised}</div>
                        <div>{item.detail.tokensissued}</div>
                    </div>
                }) : null
            }

        </div>
    </div>
);

export default CrowdsaleList;