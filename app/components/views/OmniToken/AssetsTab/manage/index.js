

import ManageForm from "./manageForm";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { omniAssetsManage } from "connectors";

const operationTypes = [{
    name: "Change Issuer",
    value: 1,
    isAll: true
},
{
    name: "Grant",
    value: 2,
    isManage: true,
},
{
    name: "Revoke",
    value: 3,
    isManage: true,
}]

const messages=defineMessages({
    changeIssuerToDestinationTipsKey:{
        id:"omni.destination.changeIssuerTips",
        defaultMessage:"Address to transfer Control and Ownership of Property to."
    },
    grantToDestinationTipsKey:{
        id:"omni.destination.grantTips",
        defaultMessage:"(Optional) Leave blank to Grant to self/sending address"
    }
})


class Index extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            operationTypes: operationTypes,
            operationType: null,
            destination: "",
            destinationInvalid: "",
            amount: null,
            showConfirmSendModal: false,
            modalTitle: <T id={`omni.assets.manage.confirmModalTitle.changeIssuer`} m="Confirm Transfer of Ownership/Control" />,
            destinationTips:this.props.intl.formatMessage(messages.changeIssuerToDestinationTipsKey),
        }
    }
    componentDidMount = () => {

        const { location: { query } } = this.props;

        const types = operationTypes.filter(item => (item.isAll || item.isManage + "" == query.managedissuance));
        this.setState({
            operationTypes: types,
            operationType: types ? types[0] : null
        })

    }
    onChangeOutputDestination = (destination) => {
        let destinationInvalid = false;
        let updateDestinationState = () => {
            this.setState({
                destination,
                destinationInvalid
            }, this.onAttemptConstructTransaction);
        };

        this.props.validateAddress(destination)
            .then(resp => {
                destinationInvalid = !resp.getIsValid();
                updateDestinationState();
            })
            .catch(() => {
                destinationInvalid = false;
                updateDestinationState();
            });
    }
    getAddressError() {
        const { destination, destinationInvalid } = this.state;
        if (!destination || destinationInvalid) return <T id="send.errors.invalidAddress" m="*Please enter a valid address" />;
    }
    onChangeOutputAmount = (e) => {
        const value = e.target.value;
        if (value !== this.state.amount) {
            this.setState({ amount: value });
        }
    }
    getAmountError() {
        const { amount } = this.state;
        if (isNaN(amount)) return <T id="send.errors.invalidAmount" m="*Please enter a valid amount" />;
        if (amount <= 0) return <T id="send.errors.negativeAmount" m="*Please enter a valid amount (> 0)" />;
    }

    onOperationTypeChange = (type) => {
        if (type !== this.state.operationType) {
            let modalTitle = "";
            let destinationTips=this.props.intl.formatMessage(messages.changeIssuerToDestinationTipsKey);
            if (type.value == 1) {
                modalTitle = <T id={`omni.assets.manage.confirmModalTitle.changeIssuer`} m="Confirm Transfer of Ownership/Control" />;
                destinationTips=this.props.intl.formatMessage(messages.changeIssuerToDestinationTipsKey);
            } else if (type.value == 2) {
                modalTitle = <T id={`omni.assets.manage.confirmModalTitle.grant`} m="Confirm Grant" />;
                destinationTips=this.props.intl.formatMessage(messages.grantToDestinationTipsKey);
            } else if (type.value == 3) {
                modalTitle = <T id={`omni.assets.manage.confirmModalTitle.revoke`} m="Confirm Revoke" />
            }
            this.setState({ operationType: type, modalTitle, amount: null,destinationTips })
        }
    }
    onSend = () => {
        this.setState({ showConfirmSendModal: true });
    }
    onSubmit = () => {
        const { location: { query }, sendChangeIssuer, sendGrant, sendrevoke } = this.props;
        const { operationType, destination, amount } = this.state;
        const propertyid=parseInt(query.propertyid);
        if (operationType.value == 1) {
            sendChangeIssuer && sendChangeIssuer({ fromaddress: query.issuer, toaddress: destination, propertyid }, this.callBack)
        } else if (operationType.value == 2) {
            sendGrant && sendGrant({ fromaddress: query.issuer, toaddress: destination?destination:query.issuer, propertyid, amount }, this.callBack)
        } else if (operationType.value == 3) {
            sendrevoke && sendrevoke({ fromaddress: query.issuer, propertyid: propertyid, amount }, this.callBack)
        }

    }

    callBack = () => {
        this.props.router.goBack();
    }
    onCancelModal = () => {
        this.setState({ showConfirmSendModal: false })
    }
    getIsValid() {
        const { operationType, destinationInvalid, destination, amount } = this.state;
        if (!operationType) return false;
        else if (operationType.value === 1) return !(!destination || destinationInvalid)
        else if (operationType.value === 2) return !(destinationInvalid) && !!amount;
        else if (operationType.value === 3) return !!amount
    }
    render() {
        const { location: { query }, router } = this.props;
        const { operationTypes, operationType, destination, amount, showConfirmSendModal, modalTitle,destinationTips } = this.state;
        const isValid = this.getIsValid();
        return <ManageForm {...{
            ...this.props,
            detail: query,
            operationTypes,
            operationType,
            destination,
            addressError: this.getAddressError(),
            onChangeOutputDestination: this.onChangeOutputDestination,
            amountError: this.getAmountError(),
            onChangeOutputAmount: this.onChangeOutputAmount,
            amount,
            onOperationTypeChange: this.onOperationTypeChange,
            onSend: this.onSend,
            onSubmit: this.onSubmit,
            onCancelModal: this.onCancelModal,
            showConfirmSendModal,
            isValid,
            modalTitle,
            destinationTips,
            goBack: () => {
                router.goBack()
            }
        }} />
    }
}

export default omniAssetsManage(injectIntl(Index));