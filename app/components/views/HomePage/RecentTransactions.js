// @flow
import { home } from "connectors";
import { HcashOrgLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import { validataOS } from "helpers";
import "style/Fonts.less";
import "style/HomePage.less";

const RecentTransactions = ({
  transactions,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  const limit = validataOS() == "Mac" ? 2 : 3;
  return (
    getTransactionsRequestAttempt ? <HcashOrgLoading /> :
      <Aux>
        <div className="home-content-title">
          <T id="home.recentTransactionsTitle" m="Recent Transactions" />
        </div>
        <div className="home-content-nest">
          {transactions.length > 0 ?
            <TxHistory limit={limit} {...{ getAccountsResponse, transactions }} /> :
            <p><T id="home.noTransactions" m="No transactions" /></p>}
        </div>
      </Aux>
  );
};

export default home(RecentTransactions);
