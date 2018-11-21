import OptionsButton from 'buttons/OptionsButton';
import "style/screen.less"

const Screen = ({ title,children}) => (

        <div className="omni-screen">
            <div>{title}</div>
            <div>
               {children}
            </div>
        </div>
    );

export default Screen;