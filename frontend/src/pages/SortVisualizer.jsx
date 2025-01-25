import React, { useState, useEffect } from "react";

const SortVisualizer = () => {
  const [array, setArray] = useState([]);
  const [arrayOriginal, setArrayOriginal] = useState([]);
  const [socket, setSocket] = useState(null);
  const [arrayAccesses, setArrayAccesses] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const [delay, setDelay] = useState(0.01);
  const [throttle, setThrottle] = useState(1);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("bubble_sort");
  const [displayName, setDisplayName] = useState("Bubble Sort");
  const [size, setSize] = useState(500);
  const [isSorted, setIsSorted] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("wss://algovisualized-production.up.railway.app/ws/sort/");
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      ws.send(
        JSON.stringify({
          action: "generate_array",
          size: size, 
        })
      );
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      if (data.isSorted !== undefined && data.isSorted !== isSorted) {
        setIsSorted(data.isSorted);
        setHighlightedIndices([]);
        if (data.isSorted) setIsSorting(false);
      }

      if (data.array) {
        const arrayCopy = [...data.array];
        setArray(arrayCopy);
        if (arrayOriginal.length === 0 && !isSorted) {
          setArrayOriginal(arrayCopy); 
        }
      }

      if (data.comparisons !== undefined) {
        setComparisons(data.comparisons);
      }
      if (data.arrayAccesses !== undefined) {
        setArrayAccesses(data.arrayAccesses);
      }
      if (data.swaps !== undefined) {
        setSwaps(data.swaps);
      }
      if (data.highlightedIndices !== undefined) {
        setHighlightedIndices(data.highlightedIndices);
      }
      if (data.reset !== undefined && data.array !== undefined) {
        setArray([...data.array]);
        setArrayAccesses(0);
        setSwaps(0);
        setTimeElapsed(0);
        setComparisons(0);
        setHighlightedIndices([]);
        setSize(500);
        setIsSorted(false);
        setIsSorting(false);
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    return () => {
      ws.close();
    };
  }, []);

  const generateArray = () => {
    socket.send(
      JSON.stringify({
        action: "generate_array",
        size: size,
      })
    );
    setIsSorted(false);
  };

  const sortArray = () => {
    socket.send(
      JSON.stringify({
        action: "sort_array",
        algorithm: selectedAlgorithm,
        delay: delay,
        throttle: throttle,
      })
    );
    setIsSorting(true);
  };
  const algorithmMap = {
    "Bubble Sort": "bubble_sort",
    "Quick Sort": "quick_sort",
    "Merge Sort": "merge_sort",
    "Selection Sort": "selection_sort",
    "Insertion Sort": "insertion_sort",
    "Radix Sort": "radix_sort",
    "Heap Sort": "heap_sort",
  };
  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    setSize(selectedSize);
  };

  const handleAlgorithmChange = (event) => {
    const selectedDisplayName = event.target.value;
    setSelectedAlgorithm(algorithmMap[selectedDisplayName]);
    setDisplayName(selectedDisplayName);
  };
  const resetVisualizer = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          action: "reset",
        })
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black min-h-screen text-gray-200">
      {/* Algorithm Name */}
      <div>
        <h3 className="text-4xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">
          {displayName}
        </h3>
      </div>
      {/* Bars Container */}
      <div
        className="flex justify-center items-end w-full max-w-5xl overflow-hidden border border-gray-700 rounded-lg p-2 bg-gray-800"
        style={{ height: "250px" }}
      >
        {array.map((value, index) => (
          <div
            key={index}
            className={`flex-1 transition-[height,background-color] duration-300 ease-in-out ${
              isSorted
                ? "bg-green-500"
                : highlightedIndices.includes(index)
                ? "bg-[#ff6347] shadow-[0_0_10px_rgba(255,99,71,0.6)] border-2 border-[#d63a3a] rounded-[5px]"
                : "bg-blue-500"
            }`}
            style={{
              height: `${value}px`,
              margin: "0 0.1px", 
            }}
          ></div>
        ))}
      </div>

      {/* Button Section */}
      <div className="flex flex-wrap gap-4 justify-center">
        {/* Generate Array Button */}
        <button
          onClick={generateArray}
          className={`bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-500 transition w-full sm:w-auto ${
            isSorting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSorting}
        >
          Generate Array
        </button>
        <div className="flex flex-col items-center space-y-4 w-full sm:w-auto">
          <label
            htmlFor="delaySlider"
            className={`text-lg font-medium ${
              isSorting ? "text-gray-500" : "text-gray-300"
            }`}
          >
            Adjust Delay: <span className="text-blue-400">{delay}s</span>
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
            disabled={isSorting}
          />
        </div>
        <div>
          <div className="w-full sm:w-auto">
            <select
              id="sizeSelector"
              className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg w-full"
              onChange={handleSizeChange}
              value={size}
              disabled={isSorting}
            >
              <option value="2000">Size: 2000</option>
              <option value="1000">Size: 1000</option>
              <option value="500">Size: 500</option>
              <option value="100">Size: 100</option>
              <option value="10">Size: 10</option>
              <option value="5">Size: 5</option>
            </select>
          </div>
          <br />
          <div className="w-full sm:w-auto">
            <select
              value={Object.keys(algorithmMap).find(
                (key) => algorithmMap[key] === selectedAlgorithm
              )} 
              onChange={handleAlgorithmChange}
              className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg w-full"
              disabled={isSorting}
            >
              {Object.keys(algorithmMap).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={sortArray}
          className={`bg-green-600 text-white py-2 px-4 rounded shadow-lg hover:bg-green-500 transition w-full sm:w-auto ${
            isSorting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSorting}
        >
          Sort Array
        </button>
        <button
          onClick={resetVisualizer}
          className="bg-red-600 text-white py-2 px-4 rounded shadow-lg hover:bg-red-500 transition w-full sm:w-auto"
        >
          Reset
        </button>
      </div>

      {/* Stats Section */}
      <div className="flex flex-col items-center gap-2 bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-xl">
        <h5 className="text-lg font-bold">Sorting Stats</h5>
        <div className="text-sm">
          <p>
            Array Accesses:{" "}
            <span className="text-blue-400">{arrayAccesses}</span>
          </p>
          <p>
            Element Swaps: <span className="text-green-400">{swaps}</span>
          </p>
          <p>
            Time Elapsed:{" "}
            <span className="text-yellow-400">
              {(timeElapsed * 1000).toFixed(2)} ms
            </span>
          </p>
          <p>
            Comparisons: <span className="text-purple-400">{comparisons}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SortVisualizer;
