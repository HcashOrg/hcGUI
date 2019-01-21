import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { injectIntl } from "react-intl";
import { balance } from "connectors";
import messages from "./messages";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, intl, currencyDisplay }) => {
  const lockedKey = intl.formatMessage(messages.lockedKey);
  const votedKey = intl.formatMessage(messages.votedKey);
  const ticketKey = intl.formatMessage(messages.ticketKey);
  const revokedKey = intl.formatMessage(messages.revokedKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [votedKey]: s.voted,
    [revokedKey]: s.revoked,
    [ticketKey]: s.ticket,
    [lockedKey]: s.locked,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={displayData} margin={{ top: 20, right: 0, left: 20, bottom: 20 }}>
        <XAxis dataKey="name" tick={{ stroke: '#ffffff', fill: "#ffffff", strokeWidth: 1 }} />
        <YAxis orientation="right" tick={{ stroke: '#ffffff', fill: "#ffffff", strokeWidth: 1 }} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0)' }} />
        <Legend />
        <Bar barSize={8} dataKey={lockedKey} stackId="a" fill="#8539dd" radius={[0, 0, 10, 10]} unit={currencyDisplay} />
        <Bar barSize={8} dataKey={revokedKey} stackId="a" fill="red" radius={[0, 0, 0, 0]} unit={currencyDisplay} />
        <Bar barSize={8} dataKey={votedKey} stackId="a" fill="#f60fff" radius={[0, 0, 0, 0]} unit={currencyDisplay} />
        <Bar barSize={8} dataKey={ticketKey} stackId="a" fill="#68d7ff" radius={[10, 10, 0, 0]} unit={currencyDisplay} />
      
      </BarChart>
    </ResponsiveContainer>
  )
};

export default balance(injectIntl(BalanceChart));
