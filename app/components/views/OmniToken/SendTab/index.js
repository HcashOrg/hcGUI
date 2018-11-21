import { FormattedMessage as T } from "react-intl";
import SendTabPage from './sendTabPage'; 
import {omniSend} from "connectors"; 

 

class SendPage extends React.Component {
  constructor(props) {
    super(props);
    this.state=this.getInitialState(this.props);
  }

  getInitialState(props) {
    return {
      address:props.walletAssetsBalances && props.walletAssetsBalances.length>0?props.walletAssetsBalances[0].addressData[0]:null,
      asset:props.walletAssetsBalances && props.walletAssetsBalances.length>0?props.walletAssetsBalances[0]:null, 
      destination: "", 
      amount: null,
      showConfirmSendModal:false, 
    };
  }

  componentDidMount=()=>{
    this.props.getwalletaddressbalances();
  }
  onCancelModal=()=>{
    this.setState({showConfirmSendModal:false});
  }
  getOnChangeOutputDestination=(destination)=> { 
      let destinationInvalid = false;
      let updateDestinationState = () => {
        this.setState({
          destination,
          destinationInvalid
        },this.onAttemptConstructTransaction);
      };

      this.props.validateAddress(destination)
        .then( resp => {
          destinationInvalid = !resp.getIsValid();
          updateDestinationState();
        })
        .catch( () => {
          destinationInvalid = false;
          updateDestinationState();
        }); 
  }
  getOnChangeOutputAmount=(e)=> {    
    const value=e.target.value; 
    if (value !== this.state.amount) {
      this.setState({amount:value},this.onAttemptConstructTransaction);
    }
  }
  getAddressError() {
    const { destination,destinationInvalid } = this.state; 
    if (!destination || destinationInvalid) return <T id="send.errors.invalidAddress" m="*Please enter a valid address" />;
  }

  getAmountError() {
    const { amount} = this.state; 
    if (isNaN(amount)) return <T id="send.errors.invalidAmount" m="*Please enter a valid amount" /> ;
    if (amount <= 0) return <T id="send.errors.negativeAmount" m="*Please enter a valid amount (> 0)" />;
  }

  onAddressChange=(address)=>{
    if(address!==this.state.address){
      this.setState({address})
    } 
  }

  onAssetsChange=(asset)=>{ 
    if(asset!==this.state.asset){
      this.setState({asset,address:asset.addressData[0]})
    } 
  }

  getIsValid() {
    const {address,asset,destination,destinationInvalid,amount} = this.state; 
    return !!(address && asset && !(!destination || destinationInvalid) && amount && (parseFloat(amount)<=parseFloat(address.balance)));
  }
  onSend=() =>{
    if (!this.getIsValid()) return;
    this.setState({showConfirmSendModal:true}) 
  }

  onSubmit=()=>{ 
    if (!this.getIsValid()) return;

    const { send_func } = this.props; 
    const {address,destination,amount,asset} =this.state;  
    send_func  && send_func({fromaddress:address.address,toaddress:destination,propertyid:asset.propertyid,amount:amount});
    this.onClearTransaction();
  }

  onAttemptConstructTransaction=()=> {
    const { onAttemptConstructTransaction } = this.props;  
    if (!this.getIsValid()) return; 
    onAttemptConstructTransaction && onAttemptConstructTransaction(
      0,
      0,
      [{amount: this.state.amount, destination: this.state.destination }]
    );
  }




  onClearTransaction=()=> {
    this.setState(this.getInitialState(this.props)); 
  }

  componentWillReceiveProps=(nextProps)=>{ 
    if (nextProps.walletAssetsBalances != this.props.walletAssetsBalances) {
      this.setState(this.getInitialState(nextProps),this.onAttemptConstructTransaction);
    }
  }
  render() { 
    const {walletAssetsBalances} =this.props;
    const {address,asset,destination,amount,showConfirmSendModal} = this.state;
    const isValid = this.getIsValid();
    return  <SendTabPage {...{
        addressList:asset?asset.addressData:null,
        onAddressChange:this.onAddressChange,
        assetsList:walletAssetsBalances,
        onAssetsChange:this.onAssetsChange,
        getOnChangeOutputDestination:this.getOnChangeOutputDestination,
        getOnChangeOutputAmount:this.getOnChangeOutputAmount,
        addressError:this.getAddressError(),
        amountError:this.getAmountError(),  
        address,
        asset:asset,
        destination,
        amount,
        isValid,

        onSend:this.onSend,
        showConfirmSendModal,
        onCancelModal:this.onCancelModal,
        onSubmit:this.onSubmit,
        

    }}/>
  } 
}

export default omniSend(SendPage);
