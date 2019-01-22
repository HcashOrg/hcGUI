// @flow
import { home } from "connectors";
import { HcashOrgLoading } from "indicators";
import TxHistory from "TxHistory";
import { FormattedMessage as T } from "react-intl";
import { validataOS } from "helpers";
import "style/Fonts.less";
import "style/HomePage.less";

const RecentTickets = ({
  tickets,
  getTransactionsRequestAttempt,
  getAccountsResponse,
}) => {
  const limit = validataOS() == "Mac" ? 2 : 3;
  return (
    getTransactionsRequestAttempt ? <HcashOrgLoading /> :
      <Aux>
        <div className="home-content-title">
          <T id="home.ticketActivityTitle" m="Recent Tickets" />
        </div>
        <div className="home-content-nest">
          {tickets.length > 0 ?
            <TxHistory limit={limit} {...{ getAccountsResponse, transactions: tickets }} /> :
            <p><T id="home.noTickets" m="No tickets" /></p>}
        </div>
      </Aux>
  );
};

export default home(RecentTickets);
