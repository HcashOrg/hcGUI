import "style/card.less"
const card = ({ title, children,className }) => {
    const cName=`hc-card ${className}`;
    return <div className={cName}>
        {title?<div className="hc-card-title">
            {title}
        </div>:null}
        <div className="hc-card-content">
            {children}
        </div>

    </div>
}

export default card;