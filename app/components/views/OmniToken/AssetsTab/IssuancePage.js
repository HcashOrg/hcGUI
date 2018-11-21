import Screen from './issuanceScreen';
import { FormattedMessage as T } from "react-intl";
import IssuanceForm from './IssuanceForm';
import ConfirmAssetsModal from "./confirmAssetsModal";
import { omniIssuanceForm } from "connectors";


class Issue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ecosystem: "",
            nameError: "",
            name: "",
            urlError: "",
            url: "",
            category: null,
            subCategory: null,
            description: "",

            amountError: "",
            amount: "",
            address: null,
            addressError: "",

            showConfirmAssetsModal: false,
        }
    }


    onEcosystemChanged = (value) => {
        this.setState({ ecosystem: value });
    }
    onDivisibleEnumchanged = (divisible) => {
        if (divisible !== this.state.divisible) {
            this.setState({ divisible });
        }
    }
    onNameChange = (value) => {
        if (value !== this.state.name) {
            this.setState({ name: value });
        }
    }
    onUrlChange = (value) => {
        if (value !== this.state.url) {
            this.setState({ url: value });
        }
    }
    onCategoryChange = (category) => {
        if (category !== this.state.category) {
            this.setState({ category, subCategory: null });
        }
    }
    onSubCategoryChange = (subCategory) => {
        if (subCategory !== this.state.subCategory) {
            this.setState({ subCategory });
        }
    }
    onAssetDescriptionChange = (value) => {
        if (value !== this.state.description) {
            this.setState({ description: value });
        }
    }
    onAddressChange = (address) => { 
        let addressInvalid = false;
        let updateDestinationState = () => { 
            this.setState({
                address,
                addressInvalid
            });
        };

        this.props.validateAddress(address)
            .then(resp => {
                addressInvalid = !resp.getIsValid();
                updateDestinationState();
            })
            .catch(() => {
                addressInvalid = false;
                updateDestinationState();
            });


    }
    getAddressError() {
        const { address,addressInvalid } = this.state; 
        if (!address || addressInvalid) return <T id="send.errors.invalidAddress" m="*Please enter a valid address" />;
    }
    onAmountChange = (value) => {
        if (value != this.state.amount) {
            this.setState({ amount: value });
        }
    }
    componentWillReceiveProps = (nextProps) => {
        if (nextProps.walletAssetsBalances != this.props.walletAssetsBalances) {
            this.setState(this.getInitialState(nextProps), this.onAttemptConstructTransaction);
        }
    }
    onNextStep = () => {
        if (this.getIsValid()) {
            this.setState({ showConfirmAssetsModal: true })
        }
    }

    getIsValid = () => {
        const { name, divisible, category, subCategory, url, description, address,addressInvalid, amount } = this.state;
        const { formType } = this.props;
        return !!(name && divisible && category && subCategory && url && description && !(!address || addressInvalid) && (amount || formType == "managed"));
    }


    onCancelConfirmAssetsModal = () => {
        this.setState({ showConfirmAssetsModal: false })
    }

    onSubmit = () => {
        const { ecosystem, name, divisible, category, subCategory, url, description, address, amount } = this.state;

        const { formType } = this.props;
        if (formType == "managed") {
            this.props.sendIssuanceManaged && this.props.sendIssuanceManaged({
                fromaddress: address,
                ecosystem: ecosystem,
                type: divisible.value,
                previousid: 0,
                category: category.categoryName,
                subcategory: subCategory.categoryName,
                name: name,
                url: url,
                data: description,
            }, () => {
                this.quit();
            });
        } else {
            this.props.sendIssuanceFixed && this.props.sendIssuanceFixed({
                fromaddress: address,
                ecosystem: ecosystem,
                type: divisible.value,
                previousid: 0,
                category: category.categoryName,
                subcategory: subCategory.categoryName,
                name: name,
                url: url,
                data: description,
                amount: amount
            }, () => {
                this.quit();
            });
        }
    }
    quit = () => {
        this.props.router.goBack();
    }
    render() {
        const { nameError, urlError, amountError, showConfirmAssetsModal } = this.state;

        const { name, category, subCategory, url, description, address, amount} = this.state;
        const { router, tabTitle, formType } = this.props;
        const disabled = !this.getIsValid();
        return (
            <div>
                <Screen {
                    ...{
                        tabTitle,
                        onEcosystemChanged: this.onEcosystemChanged
                    }
                } />
                <IssuanceForm {
                    ...{
                        onDivisibleEnumchanged: this.onDivisibleEnumchanged,
                        onNameChange: this.onNameChange,
                        name,
                        nameError,
                        onUrlChange: this.onUrlChange,
                        url,
                        urlError,
                        onCategoryChange: this.onCategoryChange,
                        onSubCategoryChange: this.onSubCategoryChange,
                        onAssetDescriptionChange: this.onAssetDescriptionChange,
                        description,
                        onAddressChange: this.onAddressChange,
                        amount,
                        amountError,
                        onAmountChange: this.onAmountChange,
                        router,
                        onNextStep: this.onNextStep,
                        disabled,
                        amountDisabled: formType == "managed",
                        address,
                        addressError: this.getAddressError(),
                    }
                } />

                <ConfirmAssetsModal
                    show={showConfirmAssetsModal}
                    onCancelModal={this.onCancelConfirmAssetsModal}
                    {...{
                        name,
                        category,
                        subCategory,
                        url,
                        description,
                        address,
                        amount,
                        onSubmit: this.onSubmit
                    }} />
            </div>
        )
    }
}

export default omniIssuanceForm(Issue);