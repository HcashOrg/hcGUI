import IssuancePage from '../IssuancePage';
import { FormattedMessage as T} from "react-intl"; 
const IssuePage = ({ router}) => (
    <IssuancePage 
        {
            ...{
                tabTitle:<T id="omni.issuePage.title" m="Creating intelligent assets"/>,
                formType:"issue",
                router
            }
        }
    />
);
export default IssuePage;