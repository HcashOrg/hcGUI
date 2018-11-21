
import OptionsButton from 'buttons/OptionsButton';
import Screen from 'shared/screen';
import { FormattedMessage as T,injectIntl,defineMessages } from "react-intl"; 
defineMessages({
    selectedAddress:{
        id:"omni.screenTitle.historicalRecords",
        defaultMessage:"Historical Records"
    }
})

const Index = ({ addressList,
    onAddressChanged,
    selectAddress,intl }) => {
        const title=intl.formatMessage({id:"omni.screenTitle.historicalRecords",defaultMessage:"Historical Records"})
        return(
        <Screen title={title}>
             <T id="omni.wallet.selected.address" m="address"/>  <OptionsButton btnClass="browseType-operation" {...{
                onMenuChanged: onAddressChanged,
                menuItemDatas: addressList,
                btnText: selectAddress
            }} />
        </Screen>


    )};

export default injectIntl(Index);