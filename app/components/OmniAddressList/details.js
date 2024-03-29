 
 import { FormattedMessage as T } from "react-intl"; 
 const details=({  
            assetsDatas
       })=>(
        <div className="addressList-row-detail">
            <div className="addressList-row-detail-header">
                    <div><T id="omni.asstes.name" m="asstes"/></div>
                    <div><T id="omni.asstes.balance" m="balance"/></div> 
                    {/* <div><T id="omni.asstes.frozen" m="frozen"/></div> */}
                    <div><T id="omni.asstes.reserved" m="reserved"/></div>
            </div> 
            {
                assetsDatas.map(item=>{
                    return  <div key={item.propertyid}>
                                <div>{item.name}(#{item.propertyid})</div>
                                <div>{item.balance}</div> 
                                {/* <div>{item.frozen}</div> */}
                                <div>{item.reserved}</div>
                            </div>
                })
            }
        </div>
    )


    export default details; 