import Select from "react-select"; 
import { injectIntl, defineMessages, intlShape } from "react-intl";

const messages = defineMessages({
  placeholder: {
    id: "accountsSelect.placeholder",
    defaultMessage: "Select account"
  },
});

@autobind
class InputSelect extends React.Component { 
  static propTypes = { 
    intl: intlShape.isRequired,
    className: PropTypes.string,  
    datas:PropTypes.array,
    valueKey:PropTypes.string,
    labelKey:PropTypes.string,
    spendableKey:PropTypes.string,
    disabled:PropTypes.bool,
  };

  constructor(props) {
    super(props);
    
    this.state = {
        data:this.props.datas?this.props.datas[0]:{}
    };
  }
  componentWillReceiveProps=(nextProps)=>{ 
    if (nextProps.datas != this.props.datas) {
      this.setState({data:nextProps.datas?nextProps.datas[0]:null});
    }
  }
  render() {
    const { formatMessage } = this.props.intl;
    const { className,datas,valueKey,labelKey,disabled } = this.props; 
    return (
      <div className={className}>
        <Select 
          clearable={false}
          style={{zIndex:"9"}}
          placeholder={formatMessage(messages.placeholder)}
          multi={false}
          value={this.state.data}
          valueKey={valueKey?valueKey:"value"}
          labelKey={labelKey?labelKey:"name"}
          options={datas}
          valueRenderer={this.valueRenderer}
          optionRenderer={this.valueRenderer}
          onChange={this.onChangeAccount}
          className="accounts-select"
          disabled={disabled} 
        />
      </div>
    );
  }

  valueRenderer=(option) =>{
    //return <span><span>{option.name}</span></span>;
    const { spendableKey,labelKey } = this.props;
    const label = labelKey?labelKey:"name";
    return (
        <div className="accounts-select-value">
            <div className="address-select-name">{option[label]}</div>
            {spendableKey?<div className="accounts-select-spendable">
              {option[spendableKey]}
            </div>:null}
        </div>
    );
  }

  onChangeAccount(data) {
    if(data!==this.state.data){
        this.setState({data})
    }
    this.props.onChange && this.props.onChange(data);
  }
}

export default injectIntl(InputSelect);
