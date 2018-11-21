import { compose } from "fp";
import Card from "card";
import { Input, InputSelect, TextArea } from "inputs";
import { omniIssuanceForm } from "connectors";
import { FormattedMessage as T ,injectIntl,defineMessages} from "react-intl"; 
import {getByteLen} from "helpers"
import "style/omniForm.less";

const messages=defineMessages({
    tipskey:{
        id:"omni.assetsInfoForm.tips",
        defaultMessage:"{tips} residual characters"
    },
    divisibleEnumToYeskey:{
        id:"omni.assetsInfoForm.divisibleEnumToYes",
        defaultMessage:"Yes"
    },
    divisibleEnumToNokey:{
        id:"omni.assetsInfoForm.divisibleEnumToNo",
        defaultMessage:"No"
    },
    firstCategoryKey:{
        id:"omni.assetsInfoForm.firstCategory",
        defaultMessage:"Please choose"
    }

})

class AssetsInfoForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            categories: null,
            subCategorise: null,
            subCategory: null,
            descriptionMaxLength: 255,
            tips: this.props.intl.formatMessage(messages.tipskey, { tips: 255 }),
        }
    }
    componentWillMount = () => {
        this.props.getCategories().then(categories => {
            categories = [...this.firstCategory(), ...categories];
            this.setState({
                categories
            })
        });
    }
    componentDidMount = () => {
        this.props.onDivisibleEnumchanged(this.divisibleEnum()[0]);
    }

    firstCategory = () => {
        return [
            {
                default: true,
                subCategories: [],
                categoryName: this.props.intl.formatMessage(messages.firstCategoryKey),
            }
        ]
    }
    divisibleEnum = () => [
        {
            text: this.props.intl.formatMessage(messages.divisibleEnumToYeskey),
            value: 2,
        }, {
            text: this.props.intl.formatMessage(messages.divisibleEnumToNokey),
            value: 1,
        }
    ]


    onCategoryChange = (category) => {
        if (category !== this.state.category) {
            this.setState({ category, subCategorise: [...this.firstCategory(), ...category.subCategories] });
            this.props.onCategoryChange && this.props.onCategoryChange(category.default ? null : category);
        }
    }

    onSubCategoryChange = (subCategory) => {
        if (subCategory !== this.state.subCategory) {
            this.setState({ subCategory });
            this.props.onSubCategoryChange && this.props.onSubCategoryChange(!!subCategory.default ? null : subCategory);
        }
    }

   

    onAssetDescriptionChange = (value) => { 
        if (value !== this.props.description && !(this.state.descriptionMaxLength - getByteLen(value)<0)) {
            this.setState({ tips: this.props.intl.formatMessage(messages.tipskey, { tips: this.state.descriptionMaxLength - getByteLen(value) }) });
            this.props.onAssetDescriptionChange && this.props.onAssetDescriptionChange(value);
        }
    }

    render() {
        const { onDivisibleEnumchanged,
            nameError,
            name,
            onNameChange,
            onUrlChange,
            url,
            urlError, 
            description } = this.props;

        const { categories, subCategorise, tips, descriptionMaxLength } = this.state;
        return <Card title={<T id="omni.assets.infoForm.cardTitle.description" m="Intelligent Asset description"/>}>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div>
                    <T id="omni.assets.infoForm.name" m="Name (ex. Bobcoin)"/>
                    </div>
                    <div>
                        <Input
                            required={true}
                            autoFocus={true}
                            showErrors={!!nameError}
                            invalid={!!nameError}
                            invalidMessage={nameError}
                            value={name}
                            className="send-address-hash-to"
                            onChange={compose(onNameChange, e => e.target.value)}
                        />
                    </div>
                </div>
                <div className="col col-sm-6">
                    <div>
                    <T id="omni.assets.infoForm.divisible" m="Divisible"/>
                    </div>
                    <div><InputSelect className="send-select-account-input" {...{
                        datas: this.divisibleEnum(),
                        onChange: onDivisibleEnumchanged,
                        labelKey: "text",
                        valueKey: "value",
                    }} /></div>
                </div>
            </div>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div>
                    <T id="omni.assets.infoForm.category" m="Category"/>
                    </div>
                    <div><InputSelect className="send-select-account-input" {...{
                        datas: categories,
                        onChange: this.onCategoryChange,
                        labelKey: "categoryName",
                        valueKey: "categoryName",
                    }} /></div>
                </div>
                <div className="col col-sm-6">
                    <div> 
                    <T id="omni.assets.infoForm.subCategory" m="Sub Category"/>
                    </div>
                    <div><InputSelect className="send-select-account-input" {...{
                        datas: subCategorise,
                        onChange: this.onSubCategoryChange,
                        labelKey: "categoryName",
                        valueKey: "categoryName",
                    }} /></div>
                </div>
            </div>
            <div className="omni-form-row">
                <div className="col col-sm-6">
                    <div>
                    <T id="omni.assets.infoForm.assetURL" m="Asset URL (enter the relevant web site to help users learn more about smart assets)"/>
                    </div>
                    <div>
                        <Input
                            required={true}
                            
                            showErrors={!!urlError}
                            invalid={!!urlError}
                            invalidMessage={urlError}
                            value={url}
                            placeholder="ex: http://my.property.url"
                            className="send-address-hash-toAssetAddress"
                            onChange={compose(onUrlChange, e => e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="omni-form-row">
                <div className="col col-sm-12">
                    <div>
                    <T id="omni.assets.infoForm.description" m="Description"/>
                    </div>
                    <div>
                        <TextArea
                            tips={tips}
                            maxlength={descriptionMaxLength}
                            value={description}
                            onChange={compose(this.onAssetDescriptionChange, e => e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    }
}

export default omniIssuanceForm(injectIntl(AssetsInfoForm));