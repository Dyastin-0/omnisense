import { useData } from "../../../contexts/data/data";
import { Loading } from "../../loading/loading";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SummaryTooltip } from "./summary-tooltip";
import { CustomShape } from "./custom-shape";

const SummaryChart = () => {
  const { months } = useData();

  return (
    <div className="content-panel">
      <h3> Monthly Summary </h3>
      <div className="container">
        {months ? (
          <ResponsiveContainer width="100%" height="98%">
            <BarChart
              width="100%"
              height="100%"
              barSize={15}
              data={months}
              margin={{ right: 30 }}
            >
              <YAxis />
              <XAxis dataKey="month" />
              <CartesianGrid />
              <Tooltip
                content={<SummaryTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar
                dataKey="total.cost"
                name="Cost"
                fill="var(--accent)"
                background={{ fill: "transparent" }}
                shape={<CustomShape />}
              />
              <Bar
                dataKey="total.consumption"
                name="Consumption"
                fill="var(--secondary-accent)"
                background={{ fill: "transparent" }}
                shape={<CustomShape />}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Loading text="No data to display." />
        )}
      </div>
    </div>
  );
};

export default SummaryChart;
