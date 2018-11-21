import Screen from './screen';
import AssetsList from './assetsList';
import { omniIssuanceList } from "connectors";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
    assetsTypeToIssueKey: {
        id: "omni.myAssets.Type.issue",
        defaultMessage: "Intelligent Assets"
    },
    assetsTypeToCrowdsaleKey: {
        id: "omni.myAssets.Type.crowdsale",
        defaultMessage: "Crowd-funding"
    },
    assetsTypeToManagedKey: {
        id: "omni.myAssets.Type.managed",
        defaultMessage: "Managed  Assets"
    }

})

class OverviewPage extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.props.listpropertiesFunc();
    }
    onAssesTypesChanged = (value) => {
        this.props.router.push(`/omni/assets/${value}`)
    }

    assetsTypes = () => [{
        text: this.props.intl.formatMessage(messages.assetsTypeToIssueKey),
        value: 'issue'
    }
        , {
        text: this.props.intl.formatMessage(messages.assetsTypeToCrowdsaleKey),
        value: 'crowdsale'
    }
        , {
        text: this.props.intl.formatMessage(messages.assetsTypeToManagedKey),
        value: 'managed'
    }]


    render() {
        const { listproperties, router } = this.props;
        const properties = listproperties ? listproperties.filter((i) => i.isMine) : [];
        return (
            <div>
                <Screen {...{
                    assetsTypes: this.assetsTypes(),
                    onAssesTypesChanged: this.onAssesTypesChanged
                }} />
                <AssetsList {
                    ...{
                        listproperties: properties,
                        router
                    }
                } />
            </div>
        )
    }
}

export default omniIssuanceList(injectIntl(OverviewPage));