import Screen from './screen';
import AssetsList from './assetsList';
import { omniIssuanceList } from "connectors";
import { ConfirmModal } from "modals";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
    assetsTypeToIssueKey: {
        id: "omni.myAssets.Type.issue",
        defaultMessage: "Intelligent Assets"
    },
    assetsTypeToCrowdsaleKey: {
        id: "omni.myAssets.Type.crowdsale",
        defaultMessage: "Crowd Assets"
    },
    assetsTypeToManagedKey: {
        id: "omni.myAssets.Type.managed",
        defaultMessage: "Managed  Assets"
    }

})

class OverviewPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            showCloseModal: false
        }
    }
    componentDidMount = () => {
        const { getActiveCrowdsales, listpropertiesFunc } = this.props;
        listpropertiesFunc && listpropertiesFunc();
    }
    onAssesTypesChanged = (value) => {
        this.props.router.push(`/omni/assets/${value}`)
    }

    onCloseCrowdsale = (assetsName,fromaddress, propertyid) => { 
        this.setState({
            showCloseModal: true,
            fromaddress, 
            propertyid,
            assetsName
        })
    }
    onCancelModal = ()=>{
        this.setState({
            showCloseModal: false,
        })
    }

    onSubmit=()=>{
        const {fromaddress,  propertyid} = this.state;
        const { sendCloseCrowdsale } = this.props;
        sendCloseCrowdsale && sendCloseCrowdsale({fromaddress,  propertyid},this.onCancelModal);
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
        const {showCloseModal, 
            propertyid,
            assetsName} =this.state;
        const properties = listproperties ? listproperties.filter((i) => i.isMine) : [];
        return (
            <div>
                <Screen {...{
                    assetsTypes: this.assetsTypes(),
                    onAssesTypesChanged: this.onAssesTypesChanged,
                }} />
                <AssetsList {
                    ...{
                        listproperties: properties,
                        router,
                        onCloseCrowdsale:this.onCloseCrowdsale
                    }
                } />
                <ConfirmModal
                    modalTitle= {<T id="omni.confirmModal.closeCrowdsaleModal" m="Close Crowdsale"/> }
                    show={showCloseModal}
                    onCancelModal={this.onCancelModal}
                    onSubmit={this.onSubmit}
                    modalContent={<T id="omni.confirmModal.closeCrowdsaleModalContent" m="Are you sure to close the crowdfunding asset {assetsName} (#{propertyid}) ?" values={{
                        assetsName,
                        propertyid
                    }}/> }
                />
            </div>
        )
    }
}

export default omniIssuanceList(injectIntl(OverviewPage));