import OptionsButton from 'buttons/OptionsButton';
import Screen from 'shared/screen';
import { FormattedMessage as T } from "react-intl"; 

const OperationBotton = ({ browseTypes, onBrowseTypesChanged, browseTypeText, createAddressTypes, onCreateAddressTypesChanged, onSend }) => (
    <Screen title={<T id="omni.myWalletAddress" m="My Wallet Address"/>}>
        <T id="omni.address.preview" m="preview"/> <OptionsButton btnClass="browseType-operation" {...{
            onMenuChanged: onBrowseTypesChanged,
            menuItemDatas: browseTypes,
            btnText: browseTypeText
        }} />
        <button className="send-operation-btn" onClick={onSend}><T id="omni.sendButton" m="Send"/></button>

        {/* <OptionsButton btnClass="createAddress-operation" { ...{onMenuChanged:onCreateAddressTypesChanged,
                                   menuItemDatas:createAddressTypes,
                                   btnText:"添加钱包地址"
                                } }/> */}
    </Screen>

);

export default OperationBotton;