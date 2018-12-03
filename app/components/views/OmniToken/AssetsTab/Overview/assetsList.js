import { shell } from "electron";
import { FormattedMessage as T } from "react-intl";

const AssetsList = ({ listproperties, router,onCloseCrowdsale }) => (

    <div className="omni-history-list">
        <div className="omni-history-list-header">
            <div><T id="omni.myAssets.Field.PropertyId" m="PropertyId" /></div>
            <div><T id="omni.myAssets.Field.Assets" m="Name" /></div>
            <div>
                <T id="omni.myAssets.Field.TotalTokens" m="TotalTokens" />
            </div>
            <div>
                <T id="omni.myAssets.Field.URL" m="URL" />
            </div>
        </div>
        <div className="omni-history-list-body">

            {listproperties ? listproperties.map(item => (
                <div key={item.propertyid}>
                    <div>{item.propertyid}
                        {item.detail.managedissuance ? <a className="stakepool-link" onClick={() => {
                            router.push({
                                pathname: `/omni/assets/manage/${item.propertyid}`,
                                query: item.detail
                            })
                        }}> (Manage) </a> : null}

                        {(!item.detail.managedissuance && !item.detail.fixedissuance) ? <a className="stakepool-link" onClick={() => {
                            onCloseCrowdsale && onCloseCrowdsale(item.name,item.detail.issuer,item.detail.propertyid,)
                        }}> (close) </a> : null}
                    </div>
                    <div><a className="stakepool-link" onClick={() => {
                        router.push({
                            pathname: `/omni/assets/details/${item.propertyid}`,
                            query: item.detail
                        })
                    }}>{item.name}</a></div>
                    <div>{item.detail.totaltokens}</div>
                    <div><a className="stakepool-link" onClick={function (x) { shell.openExternal(x); }.bind(null, item.url)}>{item.url}</a></div>
                </div>
            )) : <div className="omni-history-list-tips">
                    <T id="omni.tables.noData" m="no data" />
                </div>}

        </div>
    </div>
);

export default AssetsList;