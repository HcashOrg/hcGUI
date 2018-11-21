 
import React from "react" ;
import AssetsRow from "./Row" ;
import {omniAssetsList} from "connectors";
import { FormattedMessage as T } from "react-intl";

//   const menuItemDatas=[{
//       value:'',
//       text:'从钱包中移除'
//     }]

 class index extends React.PureComponent {
  
    constructor(props) {
        super(props);
    
        this.state = { 
           // isShowAssetsItems:false,
           assetsItemNum:0
        };
    }

    componentDidMount=()=>{
        this.props.getwalletaddressbalances();
    }

     
    onShowAssetsItem=(itemNum)=>{
        this.setState({assetsItemNum:itemNum});

    }

    onhideAssetsItem=()=>{
        this.setState({assetsItemNum:null});
    }

    onMenuChanged=(address)=>(value)=>{
        //todo   从钱包中移除 
    }
 
    render() {  
        const {walletAssetsBalances}  = this.props;

        let row=null; 
        if(walletAssetsBalances && walletAssetsBalances.length>0){
             row = walletAssetsBalances.map(item=>{
                return <AssetsRow key={item.propertyid} {
                    ...{ 
                        data:item,
                        onShowAssetsItem:this.onShowAssetsItem,
                        onhideAssetsItem:this.onhideAssetsItem,
                        isShowAssetsItem:this.state.assetsItemNum==item.name,
                        onMenuChanged:this.onMenuChanged,
                        menuItemDatas:null 
                    }
                }/>
            })
        }else{
            row = <div className="loading-more-transactions-indicator"> <T id="omni.tables.noData" m="no data" /></div>
        }

        return row
    }
}

export default omniAssetsList(index);