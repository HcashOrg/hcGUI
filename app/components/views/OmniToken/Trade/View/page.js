
import { FormattedMessage as T } from "react-intl";
import { Screen } from "shared";
import OptionsButton from 'buttons/OptionsButton';
import List from './list';


const Page = ({
    walletAddressList,
    onAddressChanged,
    walletAddress,
    onSend,
    tradeHistory,
    onDetail,


}) => (
        <div>
            <Screen title={<T id="omni.screen.tradeList.title" m="Trade List"/>}>

                <T id="omni.trade.selected.address" m="Address"/>  <OptionsButton btnClass="browseType-operation" {...{
                    onMenuChanged: onAddressChanged,
                    menuItemDatas: walletAddressList,
                    btnText: walletAddress
                }} />
                <button className="send-operation-btn" onClick={onSend}><T id="omni.sendButton" m="Send" /></button>

            </Screen>

            <List
                {...{
                    tradeHistory,
                    onDetail
                }}
            />
        </div>
    );

export default Page;