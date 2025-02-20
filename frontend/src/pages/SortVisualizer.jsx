import React, { useState, useEffect, useCallback, useRef } from "react";
import bubbleSort from "../utils/bubblesort";
import insertionSort from "../utils/insertionSort";
import selectionSort from "../utils/selectionSort";
import heapSort from "../utils/heapSort";
import mergeSort from "../utils/mergeSort";
import quickSort from "../utils/quickSort";
import shellSort from "../utils/shellSort";
import countingSort from "../utils/countingSort";

const SortVisualizer = () => {
  const [title, setTitle] = useState("Bubble Sort");
  const [array, setArray] = useState([]);
  const [auxArray, setAuxArray] = useState([]);
  const [arrayLength, setArrayLength] = useState(500);
  const [highlightedIndices, setHighlightedIndices] = useState([-1, -1]);
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [isSorted, setIsSorted] = useState(false);
  const [swapCount, setSwapCount] = useState(0);
  const [sortTime, setSortTime] = useState(0);
  const [arrayAccesses, setArrayAccesses] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [speed, setSpeed] = useState("Fast");
  const abortControllerRef = useRef(null);

  const algorithmMap = {
    "Bubble Sort": bubbleSort,
    "Selection Sort": selectionSort,
    "Insertion Sort": insertionSort,
    "Merge Sort": mergeSort,
    "Quick Sort": quickSort,
    "Heap Sort": heapSort,
    "Shell Sort": shellSort,
    "Counting Sort": countingSort,
  };

  useEffect(() => {
    generateRandomArray();
  }, [arrayLength]);

  const generateRandomArray = useCallback(() => {
    const randomArray = Array.from(
      { length: arrayLength },
      () => Math.floor(Math.random() * 150) + 1
    );
    setArray(randomArray);
    setAuxArray([...randomArray]);
    setHighlightedIndices([-1, -1]);
    setIsSorted(false);
    resetStatistics();
  }, [arrayLength]);

  const resetStatistics = () => {
    setSwapCount(0);
    setSortTime(0);
    setArrayAccesses(0);
    setComparisonCount(0);
  };

  const resetArray = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setArray([...auxArray]);
    resetStatistics();
    setHighlightedIndices([-1, -1]);
    setIsSorted(false);
  };

  const handleSizeChange = (e) => {
    setArrayLength(Number(e.target.value));
  };

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
    setTitle(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
  };

  const startSorting = useCallback(async () => {
    if (!algorithmMap[selectedAlgorithm]) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setIsSorting(true);
    setIsSorted(false);
    const speedOptions = {
      Fast: { delay: 1, updateSkip: 100 },
      Intermediate: { delay: 10, updateSkip: 10 },
      Slow: { delay: 100, updateSkip: 1 },
    };

    const { delay, updateSkip } = speedOptions[speed];

    try {
      await algorithmMap[selectedAlgorithm](
        [...array],
        (newArray) => setArray(newArray),
        (indices) => setHighlightedIndices(indices),
        delay,
        updateSkip,
        setSwapCount,
        setSortTime,
        setArrayAccesses,
        setComparisonCount,
        signal
      );
      setIsSorted(() => (signal.aborted ? false : true));
    } catch (error) {
      console.error("Sorting error:", error);
    }
    setIsSorting(false);
  }, [array, selectedAlgorithm, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black min-h-screen text-gray-200">
      <div className="text-center">
        <h3 className="text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-gray-500 text-transparent bg-clip-text drop-shadow-lg">
          {title}
        </h3>
      </div>
      <div className="flex flex-row items-center w-full gap-2">
        {/* Bars Container */}
        <div
          className="flex justify-center items-end w-full max-w-5xl overflow-hidden bg-black"
          style={{ height: "250px" }}
        >
          {array.map((value, index) => (
            <div
              key={index}
              className={`flex-1 transition-all duration-300 ease-in-out ${
                isSorted
                  ? "bg-green-500"
                  : highlightedIndices.includes(index)
                  ? "bg-[#ff6347] shadow-[0_0_10px_rgba(255,99,71,0.6)] border-2 border-[#d63a3a] rounded-[5px]"
                  : "bg-blue-500"
              }`}
              style={{
                height: `${value / 1.5}%`,
                margin: "0 0.2px",
              }}
            ></div>
          ))}
        </div>
        {/* Stats Section */}
        <div className="flex flex-col items-center gap-2 bg-black border p-4 rounded-lg shadow-lg max-w-xl">
          <h5 className="text-lg font-bold">Sorting Stats</h5>
          <div className="text-sm">
            <p>
              Array Accesses:{" "}
              <span className="text-blue-400">{arrayAccesses}</span>
            </p>
            <p>
              Element Swaps: <span className="text-green-400">{swapCount}</span>
            </p>
            <p>
              Time Elapsed:{" "}
              <span className="text-yellow-400">{sortTime.toFixed(2)} ms</span>
            </p>
            <p>
              Comparisons:{" "}
              <span className="text-purple-400">{comparisonCount}</span>
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section */}
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg shadow-lg max-w-xl">
          <button
            onClick={generateRandomArray}
            className={`bg-blue-600 text-white py-2 px-4 rounded shadow-lg hover:bg-blue-500 transition ${
              isSorting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSorting}
          >
            Generate Array
          </button>
          <button
            onClick={startSorting}
            className={`bg-green-600 text-white py-2 px-4 rounded shadow-lg hover:bg-green-500 transition ${
              isSorting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSorting}
          >
            Start Sorting
          </button>

          <button
            onClick={resetArray}
            className="bg-red-600 text-white py-2 px-4 rounded shadow-lg hover:bg-red-500 transition"
          >
            Reset
          </button>
        </div>
        <div className="flex flex-col items-center gap-2 bg-black p-4 rounded-lg shadow-lg max-w-xl">
          {/* Speed Selection */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg"
            value={speed}
            onChange={handleSpeedChange}
            disabled={isSorting}
          >
            <option value="Fast">Fast</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Slow">Slow</option>
          </select>

          {/* Size Selection */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg"
            onChange={handleSizeChange}
            value={arrayLength}
            disabled={isSorting}
          >
            <option value={2000}>2000 Elements</option>
            <option value={1000}>1000 Elements</option>
            <option value={500}>500 Elements</option>
            <option value={100}>100 Elements</option>
          </select>

          {/* Algorithm Selection */}
          <select
            className="bg-gray-800 text-white py-2 px-4 rounded shadow-lg"
            value={selectedAlgorithm}
            onChange={handleAlgorithmChange}
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
    </div>
  );
};

export default SortVisualizer;
