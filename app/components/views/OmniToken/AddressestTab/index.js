import OmniAddressList from 'OmniAddressList';
import OperationBotton from './operationBotton';
import OmniAssetsList from 'OmniAssetsList';
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { receive } from "connectors";
import "style/OmniOverviewTab.less";






const messages = defineMessages({
        browseTypeToAddressKey: {
                id:"omni.browseType.address",
                defaultMessage: "address",
        },
        browseTypeToWalletKey: {
                id:"omni.browseType.wallet",
                defaultMessage: "wallet",
        }
})

class AddressestPage extends React.PureComponent {
        constructor(props) {
                super(props);
                this.state = {
                        browseType: 'address',
                        browseTypeText: this.props.intl.formatMessage(messages.browseTypeToAddressKey),
                }
        }

        browseTypes = () => [{
                value: 'address',
                text: this.props.intl.formatMessage(messages.browseTypeToAddressKey),
        },
        {
                value: 'asstes',
                text: this.props.intl.formatMessage(messages.browseTypeToWalletKey),
        }]
        createAddressTypes = () => [{
                value: "newAddress",
                text: "创建新钱包地址"
        }, {
                value: "privateAddress",
                text: "输入带私钥的地址"
        }]
        onBrowseTypesChanged = (value) => {
                let obj = this.browseTypes().find((item) => {
                        return item.value == value
                })
                this.setState({ browseType: value, browseTypeText: obj.text });
        }
        onCreateAddressTypesChanged = value => {
                if (value === "newAddress") {
                       
                }
        }

        onSend = () => {
                this.props.router.push(`/omni/send`)
        }

        render() {
                const { browseType, browseTypeText } = this.state;
                return <Aux>  <div className="tab-card">
                        <OperationBotton {...{
                                browseTypes: this.browseTypes(),
                                onBrowseTypesChanged: this.onBrowseTypesChanged,
                                browseTypeText: browseTypeText,
                                createAddressTypes:null, //this.createAddressTypes(),
                                onCreateAddressTypesChanged: this.onCreateAddressTypesChanged,
                                onSend: this.onSend
                        }} />
                        {
                                browseType === 'address' ? <OmniAddressList /> : <OmniAssetsList />
                        }
                </div>
                </Aux>
        }
}
export default receive(injectIntl(AddressestPage));