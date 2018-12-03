import {Screen} from "shared";
import CrowdsaleTable from "./crowdsaleTable";
import { omniIssuanceList } from "connectors";
import { FormattedMessage as T } from "react-intl";


class CrowdsalePage extends React.PureComponent {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        const { getActiveCrowdsales } = this.props;
        getActiveCrowdsales && getActiveCrowdsales();
    }


    render() {
        const { activeCrowdsales,router } = this.props; 
        return (
            <Aux>
                <div className="tab-card">
                    <Screen title={<T id="omni.crowdsale.title" m="Effective crowdsales" />} />
                    <CrowdsaleTable
                        {
                        ...{ activeCrowdsales,
                            router }
                        } />
                </div>
            </Aux>
        )
    }
}

export default omniIssuanceList(CrowdsalePage);