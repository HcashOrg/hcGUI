

import CrowdsaleManageForm from "./crowdsaleManageForm";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { omniCrowdsaleManageForm } from "connectors";




class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            redeemaddress: null,
            assetsDesired: [],

            amount: null,

            showConfirmSendModal: false,

        }
    }
    componentDidMount = () => {
        const { location: { query }, walletAssetsBalances } = this.props;
        const obj = JSON.parse(query.item);
        const assets = walletAssetsBalances ? walletAssetsBalances.find(item => item.propertyid === obj.propertyiddesired) : null;
        this.setState({
            redeemaddress: assets && assets.addressData.length > 0 ? assets.addressData[0] : null,
            assetsDesired: assets ? assets.addressData : null
        })
    }
    goBack = () => {
        this.props.router.goBack();
    }
    onSend = () => {
        if (!this.getIsValid()) return;
        this.setState({ showConfirmSendModal: true })
    }
    onChangeOutputAmount = (e) => {
        const value = e.target.value;
        if (value !== this.state.amount) {
            this.setState({ amount: value });
        }
    }
    onAddressChange = (address) => {
        if (address !== this.state.redeemaddress) {
            this.setState({ redeemaddress: address })
        }
    }

    getAmountError() {
        const { amount, redeemaddress } = this.state; 
        if (isNaN(amount)) return <T id="send.errors.invalidAmount" m="*Please enter a valid amount" />;
        if (amount <= 0) return <T id="send.errors.negativeAmount" m="*Please enter a valid amount (> 0)" />;
        if (redeemaddress && parseFloat(amount) > parseFloat(redeemaddress.balance)) return  <T id="send.errors.amount" m="*Insufficient balance" />;
    }

    getIsValid() {
        const { amount, redeemaddress } = this.state;
        return !!(redeemaddress && amount && (parseFloat(amount) <= parseFloat(redeemaddress.balance)));
    }

    onCancelModal = () => {
        this.setState({ showConfirmSendModal: false })
    }
    onSubmit = () => {
        if (!this.getIsValid()) return;

        const { location: { query },send_func } = this.props;
        const data = JSON.parse(query.item);
        const {amount,redeemaddress} =this.state;  
        send_func  && send_func({fromaddress:redeemaddress.address,toaddress:data.issuer,propertyid:data.propertyiddesired,amount:amount},this.goBack);


    }
    render() {
        const { location: { query } } = this.props;
        const data = JSON.parse(query.item);
        const { redeemaddress, assetsDesired, amount, showConfirmSendModal } = this.state;
        return <CrowdsaleManageForm
            {
            ...{
                data,
                goBack: this.goBack,
                onSend: this.onSend,
                onChangeOutputAmount: this.onChangeOutputAmount,
                amountError: this.getAmountError(),
                onAddressChange: this.onAddressChange,
                amount,
                redeemaddress,
                assetsDesired,
                isValid: this.getIsValid(),

                showConfirmSendModal,
                onCancelModal:this.onCancelModal,
                onSubmit:this.onSubmit
            }
            }
        />
    }
}

export default omniCrowdsaleManageForm(injectIntl(Index));