import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";

const CurveFitVisualization = () => {
  const [dataset, setDataset] = useState({ x: [], y: [] });
  const datasetRef = useRef(dataset); // Ref to keep track of the latest dataset
  const [statistics, setStatistics] = useState({ mse: 0, r_squared: 0 });
  const [fittedCurve, setFittedCurve] = useState({ x: [], y: [] });
  const [progress, setProgress] = useState(0);
  const [degree, setDegree] = useState(2);
  const [delay, setDelay] = useState(0.1);
  const [isFitting, setIsFitting] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://algovisualized.onrender.com/ws/fit/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      ws.send(
        JSON.stringify({
          action: "generate_dataset",
        })
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      // Handle dataset received
      if (data.dataset) {
        const newDataset = {
          x: [...data.dataset.x],
          y: [...data.dataset.y],
        };
        setDataset(newDataset);
        datasetRef.current = newDataset; // Update ref
        setFittedCurve({ x: [], y: [] });
        setProgress(0);
      }

      // Handle progress updates and fitted curve updates
      if (data.progress !== undefined) {
        setProgress(data.progress);

        if (data.coefficients) {
          // Use datasetRef to access the latest dataset
          const fittedY = datasetRef.current.x.map((xi) =>
            data.coefficients.reduce(
              (sum, coeff, i) =>
                sum + coeff * xi ** (data.coefficients.length - i - 1),
              0
            )
          );
          setFittedCurve({
            x: datasetRef.current.x,
            y: fittedY,
          });
          setStatistics({ mse: data.mse, r_squared: data.r_squared });
        }
      }

      // Handle fitting completion
      if (data.isFitted) {
        setIsFitting(false);
      }

      // Handle errors during fitting
      if (data.error) {
        console.error("Error during fitting:", data.error);
        setIsFitting(false);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const handleGenerateDataset = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "generate_dataset",
        })
      );
    }
  };

  const handleStartFitting = () => {
    if (dataset.x.length === 0) return;

    setIsFitting(true);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          action: "start_fitting",
          method: "polynomial",
          degree,
          delay,
        })
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black min-h-screen text-gray-200">
      {/* Title Section */}
      <div className="text-center">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
          Curve Fitting Visualizer
        </h3>
      </div>
      <div className="max-w-7xl mx-auto p-4 flex items-center gap-8">
        {/* Stats Container */}
        <div className="flex flex-col items-center gap-6 bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm w-full">
          {/* Progress Bar */}
          <div className="w-full">
            <div className="bg-black rounded-full h-4 w-full">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-center text-gray-400 mt-2">
              Progress: {progress}%
            </p>
          </div>

          {/* Statistics */}
          <div className="text-center">
            <p className="text-lg text-yellow-400">
              mse:{" "}
              <span className="text-gray-400">{statistics.mse.toFixed(2)}</span>
            </p>
            <p className="text-lg text-purple-400 mt-2">
              r_squared:{" "}
              <span className="text-gray-400">
                {statistics.r_squared.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Plot Container */}
        <div className="flex-1">
          <Plot
            data={[
              {
                x: dataset.x,
                y: dataset.y,
                type: "scatter",
                mode: "markers",
                marker: { color: "blue" },
                name: "Dataset",
              },
              {
                x: fittedCurve.x,
                y: fittedCurve.y,
                type: "scatter",
                mode: "lines",
                line: isFitting ? { color: "red" } : { color: "green" },
                name: "Fitted Curve",
              },
            ]}
            layout={{
              title: "Curve Fitting",
              xaxis: {
                range: [Math.min(...dataset.x), Math.max(...dataset.x)],
              },
              yaxis: {
                range: [Math.min(...dataset.y), Math.max(...dataset.y)],
              },
              paper_bgcolor: "black",
              plot_bgcolor: "black",
              font: { color: "white" },
            }}
            config={{
              displayModeBar: false,
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* Generate Dataset Button */}
        <button
          onClick={handleGenerateDataset}
          className={`bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-500 transition w-full sm:w-auto ${
            isFitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isFitting}
        >
          Generate Dataset
        </button>

        {/* Polynomial Degree Input */}
        <div className="flex flex-col items-center space-y-4 w-full sm:w-auto">
          <label
            htmlFor="degreeInput"
            className="text-lg font-medium text-gray-300"
          >
            Polynomial Degree: <span className="text-blue-400">{degree}</span>
          </label>
          <input
            id="degreeInput"
            type="number"
            min="1"
            max="10"
            value={degree}
            onChange={(e) => setDegree(parseInt(e.target.value))}
            className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg w-full sm:w-auto"
          />
        </div>

        {/* Delay Slider */}
        <div className="flex flex-col items-center space-y-4 w-full sm:w-auto">
          <label
            htmlFor="delaySlider"
            className="text-lg font-medium text-gray-300"
          >
            Delay: <span className="text-blue-400">{delay}s</span>
          </label>
          <input
            id="delaySlider"
            type="range"
            min="0.01"
            max="1"
            step="0.01"
            value={delay}
            onChange={(e) => setDelay(parseFloat(e.target.value))}
            className="w-full sm:w-64 h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isFitting}
          />
        </div>

        {/* Start Fitting Button */}
        <button
          onClick={handleStartFitting}
          className={`bg-green-600 text-white py-2 px-4 rounded shadow-lg hover:bg-green-500 transition w-full sm:w-auto ${
            isFitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isFitting}
        >
          Start Fitting
        </button>
      </div>
    </div>
  );
};

export default CurveFitVisualization;
