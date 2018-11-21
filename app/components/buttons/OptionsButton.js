import React from "react";
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem'; 

import "style/OptionsButton.less"

@autobind
export default class OptionsButtion extends React.PureComponent{
    constructor(props) {
        super(props); 
        this.state = { menuOpen: false };
    } 
    onMenuRequestChange =(opening,e) => {
        this.setState({ menuOpen: opening });
        return false;
    }


    _menuItemComponent=(menuItemDatas)=>{
        return menuItemDatas.map((item)=>{
            return <MenuItem
            className={"context-menu-item "}
            key={item.value}
            value={item.value}
            style={{fontSize: null, lineHeight: null, minHeight: null, padding: null}}
            primaryText={item.text} />
        })
    }

    render(){
        const { menuOpen } = this.state; 
        const {btnClass,onMenuChanged,menuItemDatas,btnText} = this.props; 



        let component=menuItemDatas ? <IconMenu 
                                            onChange={(event, value)=>{ onMenuChanged(value) }}
                                            onRequestChange={this.onMenuRequestChange}
                                            open={menuOpen}
                                            iconButtonElement={
                                                <div className={btnClass?btnClass:"operation-butto"}>{btnText}</div>
                                            }
                                            >
                                            {this._menuItemComponent(menuItemDatas)} 
                                        </IconMenu>:null;



        return component
    }
}