import Header from "./DefaultHeader";
import { FormattedMessage as T } from "react-intl";
import "style/GetStarted.less";

const FinalStartUpHeader = () => (
  <Header
    headerMetaOverview={<T id="getStarted.header.finalizingSetup.meta" m="Finalizing setup" />} />
);

const FinalStartUpBody = () => (
  <T id="getStarted.body.finalizingSetup.meta" m="Initializing data, please be patient." />
);

export { FinalStartUpHeader, FinalStartUpBody };
