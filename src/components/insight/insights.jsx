import { useEffect, useState } from "react";
import { useData } from "../../contexts/data/data";
import { askGemini } from "../../utils/gemini";

const Insights = () => {
  const { messages, devices, consumptionAndCostData } = useData();
  const [generatedInsights, setGeneratedInsights] = useState([]);

  useEffect(() => {
    if (consumptionAndCostData.length > 0) {
      const gen = async () => {
        const data = await askGemini(
          `Analyze the data and generate insights.
          Here's the data I have:\n
          Logs: ${JSON.stringify(messages)}\n
          Devices: ${JSON.stringify(devices)}\n
          Consumption and Cost Data: ${JSON.stringify(consumptionAndCostData)}\n
          Generate the insights with these considerations: use bullets \u2022; refer to me as 'you'; don't write titles; focus on logs and consumption & cost.`
        );

        setGeneratedInsights(data.split(/[\u2022\u002A]/));
      };
      gen();
    }
  }, [consumptionAndCostData]);
  return (
    <div className="content-panel">
      <h3> Insights </h3>
      <div className="container">
        {generatedInsights?.slice(1).map((insight) => (
          <div key={insight} className="message-container">
            <p className="message">{insight}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Insights;
