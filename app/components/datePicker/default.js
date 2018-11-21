import DatePicker from "react-datepicker";
import "style/react-datepicker.less";

const D = (props) => { 
    let className = props.className ? props.className : "input-and-unit"; 
    return <DatePicker 
        {
            ...props 
         }

         className={className}
    />
}

export default D;