 import Page from "./page"
 import { purchaseAiPage } from "connectors";

@autobind
class PurchaseAi extends React.Component {

   
   componentDidMount(){
    this.props.getIfAINodeRegisted();
   }

  render() {  
    return  <Page {...this.props}/>
  }

   
}

export default purchaseAiPage(PurchaseAi);