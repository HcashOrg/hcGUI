import Screen from '../issuanceScreen';
import { FormattedMessage as T } from "react-intl";
import CrowdsaleForm from './CrowdsaleForm';
import ConfirmCrowdsaleModal from "./confirmCrowdsaleModal";
import { omniCrowdsaleForm } from "connectors";
import { addMonths } from "helpers";


class Crowdsale extends React.PureComponent {
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

            showConfirmCrowdsaleModal: false,


            issuerPercentage: null,
            issuerPercentageError: null,
            deadline: addMonths(new Date(),1),
            earlyBonus: null,
            tokenSperUnit: null,
            tokenSperUnitError: null,
            fromAddress: null,
            property: (this.props.listProperties && this.props.listProperties.length > 0) ? this.props.listProperties[0] : null,
            properties: this.props.listProperties ? this.props.listProperties.map(item => {
                item.showName = `${item.name}(${item.propertyid})`;
                return item;
            }) : [],
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



    componentWillReceiveProps = (nextProps) => {
        if (nextProps.walletAssetsBalances != this.props.walletAssetsBalances) {
            this.setState(this.getInitialState(nextProps), this.onAttemptConstructTransaction);
        }
    }
    onNextStep = () => {
        if (this.getIsValid()) {
            this.setState({ showConfirmCrowdsaleModal: true })
        }
    }

    getIsValid = () => {
        const { name, ecosystem, url, category, subCategory, issuerPercentage, deadline, earlyBonus, tokenSperUnit, fromAddress, fromAddressInvalid, property,
            divisible, description, earlyBonusInvalid } = this.state;

        return name && ecosystem && url && category && subCategory && issuerPercentage && deadline && earlyBonus && !earlyBonusInvalid && tokenSperUnit && !(!fromAddress || fromAddressInvalid) &&
            property && divisible && description;

    }


    onCancelCrowdsaleModal = () => {
        this.setState({ showConfirmCrowdsaleModal: false })
    }

    onSubmit = () => {
        if (!this.getIsValid()) return;

        const { sendIssuanceCrowdsale } = this.props;
        const { name, ecosystem, url, category, subCategory, issuerPercentage, deadline, earlyBonus, tokenSperUnit, fromAddress, property,
            divisible, description } = this.state;



        sendIssuanceCrowdsale && sendIssuanceCrowdsale({
            fromaddress: fromAddress,
            ecosystem,
            type: divisible.value,
            previousid: 0,
            category: category.categoryName,
            subcategory: subCategory.categoryName,
            name: name,
            url: url,
            data: description,
            propertyiddesired: property.propertyid,
            tokensperunit: tokenSperUnit,
            deadline: parseInt(deadline.getTime() / 1000),
            earlybonus: parseInt(earlyBonus),
            issuerpercentage: parseInt(issuerPercentage),
        }, this.quit);
    }


    quit = () => {
        this.props.router.goBack();

    }




    onIssuerPercentageChange = (value) => {
        if (this.state.issuerPercentage != value) {
            this.setState({ issuerPercentage: value });
        }
    }

    onDeadlineChange = (date) => {
        if (this.state.deadline != date) {
            this.setState({ deadline: date });
        }
    }
    onEarlyBonusChange = (value) => {
        if (this.state.earlyBonus != value) {
            this.setState({ earlyBonus: value, earlyBonusInvalid: value > 255 });
        }
    }

    getEarlyBonusError() {
        const { earlyBonus, earlyBonusInvalid } = this.state;
        if (earlyBonus && earlyBonusInvalid) return "必须小于等于 255";
    }

    onFromAddressChange = (fromAddress) => {
        let fromAddressInvalid = false;
        let updateDestinationState = () => {
            this.setState({
                fromAddress,
                fromAddressInvalid
            });
        };

        this.props.validateAddress(fromAddress)
            .then(resp => {
                fromAddressInvalid = !resp.getIsValid();
                updateDestinationState();
            })
            .catch(() => {
                fromAddressInvalid = false;
                updateDestinationState();
            });
    }

    getFromAddressError() {
        const { fromAddress, fromAddressInvalid } = this.state;
        if (!fromAddress || fromAddressInvalid) return <T id="send.errors.invalidAddress" m="*Please enter a valid address" />;
    }
    onTokenSperUnitChange = (value) => {
        if (this.state.tokenSperUnit != value) {
            this.setState({ tokenSperUnit: value });
        }

    }
    onPropertyiddesiredChange = (property) => {
        if (this.state.property != property) {
            this.setState({ property: property })
        }
    }
    render() {
        const { nameError, urlError, showConfirmCrowdsaleModal, name, category, subCategory, url, description, issuerPercentage,
            issuerPercentageError, deadline, earlyBonus, tokenSperUnit, tokenSperUnitError, fromAddress, property, properties } = this.state;
        const { router } = this.props;
        const disabled = !this.getIsValid();




        return (
            <div>
                <Screen {
                    ...{
                        tabTitle: <T id="omni.crowdsalePage.title" m="Initiating crowdfunding" />,
                        onEcosystemChanged: this.onEcosystemChanged
                    }
                } />
                <CrowdsaleForm {
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
                        router,
                        onNextStep: this.onNextStep,
                        disabled,


                        onIssuerPercentageChange: this.onIssuerPercentageChange,
                        issuerPercentage,
                        issuerPercentageError,
                        deadline,
                        onDeadlineChange: this.onDeadlineChange,
                        earlyBonusError: this.getEarlyBonusError(),
                        earlyBonus,
                        onEarlyBonusChange: this.onEarlyBonusChange,


                        fromAddress,
                        fromAddressError: this.getFromAddressError(),
                        onFromAddressChange: this.onFromAddressChange,
                        tokenSperUnit,
                        tokenSperUnitError,
                        onTokenSperUnitChange: this.onTokenSperUnitChange,
                        listProperties: properties,
                        onPropertyiddesiredChange: this.onPropertyiddesiredChange
                    }
                } />
                <ConfirmCrowdsaleModal
                    show={showConfirmCrowdsaleModal}
                    onCancelModal={this.onCancelCrowdsaleModal}
                    {...{
                        name,
                        category,
                        subCategory,
                        url,
                        description,
                        fromAddress,
                        earlyBonus,
                        issuerPercentage,
                        deadline,
                        selectedCurrency: property ? `${property.name}(${property.propertyid}) / Rate("${tokenSperUnit}")` : "",

                        onSubmit: this.onSubmit
                    }} />
            </div>
        )
    }
}

export default omniCrowdsaleForm(Crowdsale);