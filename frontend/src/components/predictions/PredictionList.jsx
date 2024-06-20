import { PieChart, Pie, Legend, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';

function PredictionList() {
  const [predictions, setPredictions] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/predictions/')
      .then(response => {
        const data = response.data;
        setPredictions(data);
        // Extract percentages from prediction data
        const percentages = data.reduce((acc, prediction) => {
          const category = prediction.prediction.split(' - ')[0];
          const percentage = parseInt(prediction.prediction.split(' - ')[1]);
          if (!acc[category]) {
            acc[category] = percentage;
          } else {
            acc[category] += percentage;
          }
          return acc;
        }, {});
        // Convert percentages object to array of objects for Recharts
        const chartData = Object.keys(percentages).map(category => ({
          value: percentages[category],
          name: category,
        }));
        console.log(chartData);
        setChartData(chartData);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>List of all Wastes</h1>
      <ul>
        {predictions.map(prediction => (
          <li key={prediction.id}>
            {prediction.text} - {prediction.prediction}
          </li>
        ))}
      </ul>
      <PieChart width={400} height={400}>
        <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label />
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default PredictionList;
