import "style/Input.less";

const TextArea = ({ 
    maxlength,
    tips,
    onChange,
    value
}) => (
  <div className="text-area">
       <textarea  maxLength={maxlength} value={value} onChange={onChange}/>
       {tips?<div className="text-area-tips">
            {tips}
       </div>:null}
 </div>
);

export default TextArea;