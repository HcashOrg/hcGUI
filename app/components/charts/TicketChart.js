import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {balance} from "connectors";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data} margin={{ top: 20, right: 0, left:20, bottom: 20 }}>
      <XAxis dataKey="name" tick={{stroke: '#ffffff', fill:"#ffffff", strokeWidth: 1}} />
      <YAxis orientation="right" tick={{stroke: '#ffffff', fill:"#ffffff", strokeWidth: 1}} />
      <Tooltip content={<ChartTooltip />} cursor={{fill:'rgba(255,255,255,0)' }} />
      <Legend />
      <Bar barSize={8} dataKey="immature" stackId="a" fill="#8539dd" radius={[0, 0, 10, 10]} unit={currencyDisplay} />
      <Bar barSize={8} dataKey="live" stackId="a" fill="#f60fff" radius={[10, 10, 10, 10]} unit={currencyDisplay} />
      <Bar barSize={8} dataKey="voted" stackId="a" fill="#68d7ff" radius={[10, 10, 0, 0]} unit={currencyDisplay} />
    </BarChart>
  </ResponsiveContainer>
);

export default balance(BalanceChart);
