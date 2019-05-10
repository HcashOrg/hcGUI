import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { balance } from "connectors";
import ChartTooltip from "./ChartTooltip";
import { injectIntl } from "react-intl";
import messages from "./messages";

const BalanceChart = ({ data, currencyDisplay, intl }) => {
  const sentKey = intl.formatMessage(messages.sentKey);
  const receivedKey = intl.formatMessage(messages.receivedKey);

  const displayData = data.map(s => ({
    name: intl.formatMessage(messages.dayMonthDisplay, { value: s.time }),
    legendName: intl.formatMessage(messages.fullDayDisplay, { value: s.time }),
    [sentKey]: s.sent ? s.sent : 0,
    [receivedKey]: s.received ? s.received : 0,
  }));


  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart stackOffset="sign" data={displayData} margin={{ top: 20, right: 0, left: 20, bottom: 20 }}>
        <XAxis dataKey="name" tick={{ stroke: '#ffffff', fill: "#ffffff", strokeWidth: 1 }} />
        <YAxis orientation="right" tick={{ stroke: '#ffffff', fill: "#ffffff", strokeWidth: 1 }} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0)' }} />
        <Legend />
        <ReferenceLine y={0} stroke='#000' />
        <Bar dataKey={sentKey} stackId="a" fill="#f60fff" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
        <Bar dataKey={receivedKey} stackId="a" fill="#8539dd" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
      </BarChart>
    </ResponsiveContainer>
  )
};

export default balance(injectIntl(BalanceChart));

