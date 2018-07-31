import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from "recharts";
import { balance } from "connectors";
import ChartTooltip from "./ChartTooltip";

const BalanceChart = ({ data, currencyDisplay }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart  stackOffset="sign" data={data} margin={{ top: 20, right: 0, left:20, bottom: 20 }}>
      <XAxis dataKey="name" tick={{stroke: '#ffffff', fill:"#ffffff", strokeWidth: 1}} />
      <YAxis orientation="right" tick={{stroke: '#ffffff', fill:"#ffffff", strokeWidth: 1}} />
      <Tooltip content={<ChartTooltip />} cursor={{fill:'rgba(255,255,255,0)' }} />
      <Legend />
      <ReferenceLine y={0} stroke='#000' />
      <Bar dataKey="sent" stackId="a" fill="#f60fff" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
      <Bar dataKey="received" stackId="a" fill="#8539dd" barSize={8} radius={[10, 10, 10, 10]} unit={currencyDisplay} />
    </BarChart>
  </ResponsiveContainer>
);

export default balance(BalanceChart);
