import Screen from 'shared/screen';
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
        console.log(router,'===========================')
        return (
            <Aux>
                <div className="tab-card">
                    <Screen title="有效众筹" />
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