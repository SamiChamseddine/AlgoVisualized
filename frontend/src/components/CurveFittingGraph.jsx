import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CurveFittingChart = ({ dataset, fittedCurve, isFitting }) => {
  // Prepare the datasets dynamically for the chart
  const chartData = {
    labels: dataset.x, // Use x-values as labels
    datasets: [
      {
        label: "Data Points",
        data: dataset.x.map((x, i) => ({ x, y: dataset.y[i] })), // Scatter points
        borderColor: "blue",
        backgroundColor: "blue",
        pointRadius: 2,
        pointHoverRadius: 7,
        showLine: false, // Points only
      },
      {
        label: "Fitted Curve",
        data: fittedCurve.x.map((x, i) => ({ x, y: fittedCurve.y[i] })), // Line data
        borderColor: isFitting ? "red" : "green",
        borderWidth: 2,
        fill: false,
        tension: 0, // No curve; make it a straight line
        showLine: true,
        pointRadius: 0, // Remove points
        pointHoverRadius: 0, // Remove hover effect on points
      },
    ],
  };

  // Chart options for a static and clean graph
  const options = {
    responsive: true,
    maintainAspectRatio: true, // Allow the chart to fill its container
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Curve Fitting",
        color: "white",
      },
    },
    scales: {
      x: {
        type: "linear", // Linear scale for proper scatter visualization
        
        min: Math.min(...dataset.x) , // Static range
        max: Math.max(...dataset.x) + 20,
      },
      y: {
        
        min: Math.min(...dataset.y) - 1, // Static range
        max: Math.max(...dataset.y) + 20,
      },
    },
    animation: {
      duration: 100, // Faster updates for responsiveness
      easing: "easeInOutQuad",
    },
  };

  return (
    <div
      style={{
        width: "1000px",
        height: "500px", // Fixed dimensions for a static graph
        backgroundColor: "black",
        padding: "20px",
        borderRadius: "10px",
        overflow: "hidden", // Prevent unwanted scrollbars
      }}
    >
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CurveFittingChart;
