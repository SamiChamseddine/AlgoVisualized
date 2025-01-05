import React, { useState, useEffect, useCallback } from "react";
import bubbleSort from "../utilities/bubbleSort";
import selectionSort from "../utilities/selectionSort";
import insertionSort from "../utilities/insertionSort";
import mergeSort from "../utilities/mergeSort";
import quickSort from "../utilities/quickSort";
import heapSort from "../utilities/heapSort";
import radixSort from "../utilities/radixSort";
import lsdRadixSort from "../utilities/lsdRadixSort";
import shellSort from "../utilities/shellSort";
import countingSort from "../utilities/countingSort";
import msdRadixSort from "../utilities/msdRadixSort";
import timSort from "../utilities/timSort";
import "../styles/SortVisualizer.css";


function SortVisualizer() {
  const [array, setArray] = useState([]);
  const [auxArray, setAuxArray] = useState([]);
  const [arrayLength, setArrayLength] = useState(10);
  const [currentIndices, setCurrentIndices] = useState([-1, -1]);
  const [isSorting, setIsSorting] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Bubble Sort");
  const [isSorted, setIsSorted] = useState(false);
  const [delay, setDelay] = useState(1000);
  const [updateSkip, setUpdateSkip] = useState(1);
  const [swapCount, setSwapCount] = useState(0);
  const [sortTime, setSortTime] = useState(0);
  const [arrayAccesses, setArrayAccesses] = useState(0);
  const [comparisonCount, setComparisonCount] = useState(0);
  const [speed, setSpeed] = useState("Fast");

  // UseEffect hook to generate random array whenever arrayLength changes
  useEffect(() => {
    generateRandomArray();
  }, [arrayLength]);

  // Generate a random array and store the unsorted version
  const generateRandomArray = useCallback(() => {
    const randomArray = Array.from(
      { length: arrayLength },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(randomArray);
    setAuxArray([...randomArray]); // store the unsorted version in auxArray
    setCurrentIndices([-1, -1]);
    setIsSorting(false);
    setIsSorted(false);
    resetStatistics();
  }, [arrayLength]); // Use arrayLength directly to generate the array

  // Reset statistics for sorting
  const resetStatistics = () => {
    setSwapCount(0);
    setSortTime(0);
    setArrayAccesses(0);
    setComparisonCount(0);
  };

  // Reset array to the unsorted version
  const resetArray = () => {
    setArray([...auxArray]); // reset array to the unsorted version
    setIsSorted(false); // Reset sorted state
    resetStatistics(); // Reset stats
    setCurrentIndices([-1, -1]);
  };

  // Start sorting the array
  const startSorting = useCallback(
    (delay, updateSkip) => {
      setIsSorting(true);

      const sortingAlgorithms = {
        "Bubble Sort": bubbleSort,
        "Selection Sort": selectionSort,
        "Insertion Sort": insertionSort,
        "Merge Sort": mergeSort,
        "Quick Sort": quickSort,
        "Heap Sort": heapSort,
        "Radix Sort": radixSort,
        "Shell Sort": shellSort,
        "Counting Sort": countingSort,
        "LSD Radix Sort": lsdRadixSort,
        "MSD Radix Sort": msdRadixSort,
        "Tim Sort": timSort,
      };

      // Define speed options with delay and updateSkip
      const speedOptions = {
        Fast: { delay: 1, updateSkip: 100 },
        Intermediate: { delay: 1, updateSkip: 10 },
        Slow: { delay: 1000, updateSkip: 1 },
      };

      // Get the delay and updateSkip based on selected speed
      const { delay: newDelay, updateSkip: newUpdateSkip } =
        speedOptions[speed];

      const selectedSort = sortingAlgorithms[selectedAlgorithm];
      if (selectedSort) {
        selectedSort(
          array,
          (updatedArray) => setArray(updatedArray),
          (indices) => setCurrentIndices(indices),
          newDelay, // Pass updated delay
          newUpdateSkip, // Pass updated updateSkip
          (swapCount) => setSwapCount((prev) => Math.max(prev, swapCount)),
          (sortTime) => setSortTime((prev) => Math.max(prev, sortTime)),
          (arrayAccesses) =>
            setArrayAccesses((prev) => Math.max(prev, arrayAccesses)),
          (comparisonCount) =>
            setComparisonCount((prev) => Math.max(prev, comparisonCount))
        ).then(() => {
          setIsSorting(false);
          setIsSorted(true);
        });
      }
    },
    [array, selectedAlgorithm, speed]
  ); // Added speed as a dependency

  return (
    <div className="container-og">
      <div style={{ justifyContent: "center" }}>
        <div className="controls">
          <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
            <option value="Fast">Fast</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Slow">Slow</option>
          </select>
        </div>

        <div className="controls">
          <select
            value={arrayLength}
            onChange={(e) => setArrayLength(Number(e.target.value))}
          >
            <option value={1000}>1000 elements</option>
            <option value={500}>500 elements</option>
            <option value={100}>100 elements</option>
            <option value={20}>20 elements</option>
            <option value={5}>5 elements</option>
          </select>
        </div>
        <div className="controls">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            disabled={isSorting}
          >
            <option value="Bubble Sort">Bubble Sort</option>
            <option value="Selection Sort">Selection Sort</option>
            <option value="Insertion Sort">Insertion Sort</option>
            <option value="Merge Sort">Merge Sort</option>
            <option value="Quick Sort">Quick Sort</option>
            <option value="Heap Sort">Heap Sort</option>
            <option value="Radix Sort">Radix Sort</option>
            <option value="Shell Sort">Shell Sort</option>
            <option value="Counting Sort">Counting Sort</option>
            <option value="LSD Radix Sort">LSD Radix</option>
            <option value="MSD Radix Sort">MSD Radix</option>
            <option value="Tim Sort">Tim Sort</option>
          </select>
        </div>
      </div>
      <div className="container">
        <h1>{selectedAlgorithm} Visualizer</h1>
        <div className="sorting-container">
          {array.map((value, index) => (
            <div key={index}>
              <div>
                {array.length <= 20 && (
                  <span className="bar-value">{value}</span>
                )}
              </div>
              <div
                className={`bar ${
                  currentIndices.includes(index) ? "highlight" : ""
                }`}
                style={{
                  "--background-color": isSorted ? "#11c304" : "#c30493",
                  "--bar-height": `${value * 2.5}px`, // Custom property for bar height
                  "--array-length": array.length, // Custom property for array length
                }}
              />
            </div>
          ))}
        </div>

        <div className="controls">
          <div>
            <h3>Array Accesses: {arrayAccesses}</h3>
            <h3>Swaps: {swapCount}</h3>
            <h3>Comparisons: {comparisonCount}</h3>
            <h3>Sort Time: {sortTime.toFixed(2)}ms</h3>
          </div>
          <div>
            <button onClick={generateRandomArray} disabled={isSorting}>
              Generate New Array
            </button>
            <br />
            <button
              style={{ marginTop: "1px", marginBottom: "1px" }}
              onClick={() => startSorting(delay, updateSkip)}
              disabled={isSorting}
            >
              Start Sorting
            </button>
            <br />
          </div>
          <div>
            <button
              style={{ marginTop: "1px", marginBottom: "1px" }}
              onClick={resetArray}
              disabled={isSorting || !isSorted}
            >
              Reset This Array
            </button>
            <br />
            <button
              style={{
                backgroundColor: "red",
                marginTop: "1px",
                marginBottom: "1px",
              }}
              onClick={() => window.location.reload()} // Refresh the page
            >
              Stop And Reset Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortVisualizer;
