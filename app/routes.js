// @flow
import { Route, IndexRoute, IndexRedirect } from "react-router";
import { TabbedPage } from "shared";
import App from "./containers/App";
import HomePage from "./components/views/HomePage";
import BalanceTab from "./components/views/HomePage/Balance";
import TicketsTab from "./components/views/HomePage/Tickets";
import TransactionsTab from "./components/views/HomePage/Transactions";
import SendTab from "./components/views/TransactionsPage/SendTab";
import ReceiveTab from "./components/views/TransactionsPage/ReceiveTab";
import HistoryTab from "./components/views/TransactionsPage/HistoryTab";
import TransactionPage from "./components/views/TransactionPage";
import SettingsPage from "./components/views/SettingsPage";
import SignTab from "./components/views/SecurityPage/SignMessage";
import VerifyTab from "./components/views/SecurityPage/VerifyMessage";
import ValidateTab from "./components/views/SecurityPage/ValidateAddress";
import PurchaseTab from "./components/views/TicketsPage/PurchaseTab";
import MyTicketsTab from "./components/views/TicketsPage/MyTicketsTab";
import MyTicketsOverview from "./components/views/TicketsPage/MyTicketsTab/TicketsOverview";
import MyTicketsList from "./components/views/TicketsPage/MyTicketsTab/TicketListPage";
import GovernanceTab from "./components/views/TicketsPage/GovernanceTab";
import StatisticsTab from "./components/views/TicketsPage/StatisticsTab";
import GetStartedPage from "./components/views/GetStartedPage";
import AccountsPage from "./components/views/AccountsPage";
import WalletError from "./components/views/WalletError";
import LinksTab from "./components/views/HelpPage/LinksTab";
import LogsTab from "./components/views/HelpPage/LogsTab";
import ErrorScreen from "./components/ErrorScreen";
import InvalidRPCVersion from "./components/views/InvalidRPCVersion";
import ShutdownAppPage from "./components/views/ShutdownAppPage";

import OverviewTab from "./components/views/OmniToken/OverviewTab";
import AddressesTab from "./components/views/OmniToken/AddressestTab";
import AssetsTab from "./components/views/OmniToken/AssetsTab";
import OmniSendTab from "./components/views/OmniToken/SendTab";
import OmniHistoryTab from "./components/views/OmniToken/HistoryTab";
import OmniAssetsIndex from "./components/views/OmniToken/AssetsTab/Overview";
import OmniAssetsIssue from "./components/views/OmniToken/AssetsTab/Issue";
import OmniAssetsManaged from "./components/views/OmniToken/AssetsTab/Managed";
import OmniAssetsCrowdsale from "./components/views/OmniToken/AssetsTab/Crowdsale";
import OmniHistoryPage from "./components/views/OmniToken/HistoryTab/HistoryPage";
import OmniHistoryDetail from "./components/views/OmniToken/HistoryTab/detail";
import OmniAssetsDetail from "./components/views/OmniToken/AssetsTab/Overview/details";
import OmniAssetsManage from "./components/views/OmniToken/AssetsTab/manage";

export default (
  <Route path="/" component={App}>
    <IndexRoute component={GetStartedPage} />
    <Route path="transactions/history/:txHash" component={TransactionPage} desc />
    <Route path="home" component={HomePage} noHeader balance>
      <IndexRedirect to="balance" />
      <Route path="balance" component={BalanceTab} balance testNet />
      <Route path="tickets" component={TicketsTab} />
      <Route path="transactions" component={TransactionsTab} />
    </Route>
    <Route path="accounts" component={AccountsPage} desc />
    <Route path="transactions" component={TabbedPage} tabDesc>
      <IndexRedirect to="send" />
      <Route path="send" component={SendTab} testNet />
      <Route path="receive" component={ReceiveTab} />
      <Route path="history" component={HistoryTab} balance />
    </Route>
    <Route path="tickets" component={TabbedPage} desc ticketprice>
      <IndexRedirect to="purchase" />
      <Route path="purchase" component={PurchaseTab} />
      <Route path="mytickets" component={MyTicketsTab}>
        <IndexRoute component={MyTicketsOverview} />
        <Route path=":status" component={MyTicketsList} />
      </Route>
      <Route path="governance" component={GovernanceTab} />
      {/* <Route path="statistics"                  component={StatisticsTab}/> */}
    </Route>
    <Route path="omni" component={TabbedPage} desc omni>
      <IndexRedirect to="overview" />
      <Route path="overview" component={OverviewTab} />
      <Route path="addresses" component={AddressesTab} />
      <Route path="assets" component={AssetsTab}>
        <IndexRoute component={OmniAssetsIndex} />
        <Route path="details/:propertyid" component={OmniAssetsDetail}/>
        <Route path="crowdsale" component={OmniAssetsCrowdsale} />
        <Route path="issue" component={OmniAssetsIssue} />
        <Route path="managed" component={OmniAssetsManaged} />
        <Route path="manage/:propertyid" component={OmniAssetsManage} /> 
      </Route>
      <Route path="history" component={OmniHistoryTab}>
        <IndexRoute component={OmniHistoryPage} />
        <Route path=":txid" component={OmniHistoryDetail} />
      </Route>
      <Route path="send" component={OmniSendTab} />
      {/* <Route path="statistics"                  component={StatisticsTab}/> */}
    </Route>

    <Route path="security" component={TabbedPage} desc>
      <IndexRedirect to="sign" />
      <Route path="sign" component={SignTab} />
      <Route path="verify" component={VerifyTab} />
      <Route path="validate" component={ValidateTab} />
    </Route>
    <Route path="settings" component={SettingsPage} desc />
    <Route path="help" component={TabbedPage} tabDesc>
      <IndexRedirect to="links" />
      <Route path="links" component={LinksTab} />
      <Route path="logs" component={LogsTab} />
    </Route>
    <Route path="walletError" component={WalletError} noIcon />
    <Route path="error" component={ErrorScreen} noIcon />
    <Route path="invalidRPCVersion" component={InvalidRPCVersion} noIcon />
    <Route path="shutdown" component={ShutdownAppPage} />
  </Route>
);
