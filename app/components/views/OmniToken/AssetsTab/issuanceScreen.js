
import OptionsButton from 'buttons/OptionsButton';
import Screen from 'shared/screen';
import { FormattedMessage as T ,injectIntl,defineMessages} from "react-intl"; 

const messages=defineMessages({
    ecosystemToMainKey:{
        id:"omni.IssuanceScreen.ecosystemToMain",
        defaultMessage:"main"
    },
    ecosystemToTestKey:{
        id:"omni.IssuanceScreen.ecosystemToTest",
        defaultMessage:"Test"
    } 
})

class Index extends React.PureComponent{
    constructor(props) {
        super(props);
        this.state = {
            ecosystem:this.ecosystemDatas()[0]
        }
    }

    componentDidMount=()=>{
        this.props.onEcosystemChanged(this.state.ecosystem.value)
    }
    ecosystemDatas =()=> [{
        text:  this.props.intl.formatMessage(messages.ecosystemToMainKey),
        value: 1
    }, {
        text: this.props.intl.formatMessage(messages.ecosystemToTestKey),
        value: 2
    }];

    onEcosystemChanged=(value)=>{
        const ecosystem = this.ecosystemDatas().find(item=>item.value==value); 
        this.setState({ecosystem})
        this.props.onEcosystemChanged && this.props.onEcosystemChanged(value);
    }

    render(){
        const { tabTitle } =this.props;
        const {ecosystem} =this.state;
        return (
            <Screen title={tabTitle}>
            <T id="omni.Ecosystem" m="Ecosystem"/> <OptionsButton btnClass="createAddress-operation" {...{
                    onMenuChanged: this.onEcosystemChanged,
                    menuItemDatas: this.ecosystemDatas(),
                    btnText: ecosystem.text
                }} />
            </Screen>
        
        );
    }
} 

export default injectIntl(Index);