 
import {Card } from 'material-ui/Card';
import React from "react"
import { Balance, TransitionMotionWrapper } from "shared";
import Details from './details'
import "style/OmniAssetsList.less";


const row=({ 
    data,
    onShowAssetsItem,
    onhideAssetsItem,
    isShowAssetsItem,
    onMenuChanged,
    menuItemDatas
})=>(
        <div  className={
            isShowAssetsItem?"account-row-long":"account-row-short"
        } >
        <div  className={
                isShowAssetsItem?"account-row-details-top":"account-row"
            } 
            onClick={
                isShowAssetsItem
                  ? onhideAssetsItem
                  : () => onShowAssetsItem(data.name)
              }
        >
        <div className="account-row-top-top">
            <div className="account-row-wallet-icon" />
            <div className="account-row-top-account-name">{data.name} ({data.propertyid})<span></span></div> 
            {/* <div className="account-row-top-account-funds assets-row-top-account-funds"> 
                <span>${data.balance}</span>
            </div> */}
            <div className="account-row-top-account-funds assets-row-top-account-funds">
                {/* <Balance amount={data.balance} />  */}
                {data.balance}
            </div>
            
        </div>
        </div>
        {
            isShowAssetsItem?(<Details  {...{addressData:data.addressData,
                onMenuChanged,
                menuItemDatas
            }} />) :null
        }
        
    </div>
    )


    export default row;

 