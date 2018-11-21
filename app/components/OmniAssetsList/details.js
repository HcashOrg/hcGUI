 
import OptionsButton from 'buttons/OptionsButton'
import QRCodeButton from 'buttons/QRCodeButton'; 
import { FormattedMessage as T } from "react-intl"; 


const details=({  
    addressData,
    menuItemDatas,
    onMenuChanged
       })=>{ 
        return (
        <div className="Omni-asstesList-row-table">
            <div className="asstesList-table-row asstesList-table-header">
                    <div><T id="omni,asstes.address" m="address"/></div>
                    <div><T id="omni.asstes.balance" m="balance"/></div>
                    {/* <div>价值</div> */}
                    <div><T id="omni.asstes.operation" m="operation"/></div>
            </div>
            {
                addressData.map(item=>{
                    return  <div key={item.address} className="asstesList-table-row asstesList-table-body">
                                <div>
                                    {item.address}<QRCodeButton addr={item.address}/>
                                </div>
                                <div>{item.balance}</div>
                                {/* <div>${item.currentValue}</div> */}
                                <div>
                                   <OptionsButton btnClass="address-operation" { ...{onMenuChanged:onMenuChanged(item.address),
                                   menuItemDatas:menuItemDatas,
                                   btnText:<T id="omni.asstes.operation" m="operation"/>
                                } }/>
                                </div>
                        </div>
                })
            }
        </div>
    )}


    export default details; 