
import React from "react"
import Details from './details'
import { FormattedMessage as T } from "react-intl";
import "style/OmniAssetsList.less";


const row = ({
    data,
    onShowAssetsItem,
    onhideAssetsItem,
    isShowAssetsItem,
    onMenuChanged,
    menuItemDatas
}) => (
        <div className={
            isShowAssetsItem ? "account-row-long" : "account-row-short"
        } >
            <div className={
                isShowAssetsItem ? "account-row-details-top" : "account-row"
            }
                onClick={
                    isShowAssetsItem
                        ? onhideAssetsItem
                        : () => onShowAssetsItem(data.propertyid)
                }
            >
                <div className="account-row-top-top">
                    <div className="account-row-wallet-icon" />
                    <div className="account-row-top-account-name">{data.name} (#{data.propertyid})<span></span></div>
                    {/* <div className="account-row-top-account-funds assets-row-top-account-funds"> 
                <span>${data.balance}</span>
            </div> */}
                    <div className="account-row-top-account-funds assets-row-top-account-funds">

                        {data.balance}
                        <div className="account-row-top-spendable">
                            <T id="omni.asstes.reserved" m="reserved" />:{data.reserved}

                        </div>
                    </div>

                </div>
            </div>
            {
                isShowAssetsItem ? (<Details  {...{
                    addressData: data.addressData,
                    onMenuChanged,
                    menuItemDatas
                }} />) : null
            }

        </div>
    )


export default row;

