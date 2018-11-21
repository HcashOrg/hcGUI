import Row from "./row" ;
import PubKeyModal from './publKeyModal';
import SignMessageModal from './signMessageModal'
import {omniAssetsList} from "connectors";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";


const messages=defineMessages({
    menuItemToPublicKey:{
        id:'omni.addressPage.publicKey',
        defaultMessage:"public key"
    },
    // menuItemToPublicSignMessage:{
    //     id:'omni.addressPage.signMessage',
    //     defaultMessage:"Sign Message"
    // }
}) 

 class index extends React.PureComponent {
  
    constructor(props) {
        super(props); 
        this.state={
            showPubKeyModal:false,
            showSignMessageModal:false,
            addr:'',
            pubKey:''
        }
    }
    
    componentDidMount=()=>{
        this.props.getwalletaddressbalances();
    }

    onCancelSignMessageModal=()=>{
        this.setState({showSignMessageModal:false})
    }
    onCancelPubKeyModal=()=>{
        this.setState({showPubKeyModal:false})
    }


    menuItemDatas=()=>[{
        value:'pubKey',
        text:this.props.intl.formatMessage(messages.menuItemToPublicKey),
    }
    // ,
    // {
    //   value:'signMessage',
    //   text:this.props.intl.formatMessage(messages.menuItemToPublicSignMessage),
    // }
]

    onMenuChanged= address => value =>{ 
        if(value==='pubKey'){
            this.props.validateAddress(address).then(data=>{  
                this.setState({
                    showPubKeyModal:true,
                    addr:address,
                    pubKey:this.props.validateAddressResponse.getPubKey_asB64()
                })
            });
        }else if(value==='signMessage'){
            this.props.validateAddress(address).then(data=>{  
                this.setState({
                    showSignMessageModal:true,
                    addr:address
                })
            });
        }
        
    } 
    render() {  
        const {walletAddressBalances}  = this.props;
        const {showSignMessageModal,showPubKeyModal,addr,pubKey} =this.state;

        let row=null;
        if(walletAddressBalances && walletAddressBalances.length>0){
             row =<div> 
                            {walletAddressBalances.map(item=>{
                            return <Row key={item.address} {
                                ...{ 
                                    data:item,
                                    onMenuChanged:this.onMenuChanged(item.address),
                                    menuItemDatas:this.menuItemDatas()
                                }
                            }/>
                        })
                    }
                    <SignMessageModal  show={showSignMessageModal} onCancelModal={this.onCancelSignMessageModal} address={addr} />
                    <PubKeyModal  show={showPubKeyModal} onCancelModal={this.onCancelPubKeyModal} addr={addr} pubKey={pubKey}/>
                    </div>
        }else{
            row = <div className="loading-more-transactions-indicator"> <T id="omni.tables.noData" m="no data" /></div>
        } 
        return row
    }
}

export default omniAssetsList(injectIntl(index));