# utils/sorting.py
import asyncio

# Async Quick Sort Algorithm
async def quick_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []

    # Helper function for partitioning the array
    async def partition(arr, low, high):
        nonlocal comparisons, arrayAccesses, swaps, highlighted_indices
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            highlighted_indices = [j, high]
            comparisons += 1
            arrayAccesses += 2  # Accessing arr[j] and arr[high]
            
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]  # Swap
                arrayAccesses += 4
                swaps += 2

            # Send the data after each partition step (allow visualization update)
            if j % throttle == 0:
                await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
                await asyncio.sleep(delay)  # Delay for visualization (non-blocking)
        
        arr[i+1], arr[high] = arr[high], arr[i+1]  # Swap pivot into correct position
        arrayAccesses += 4
        swaps += 2

        # Send the data after final swap in partitioning (non-blocking)
        if high % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
            await asyncio.sleep(delay)

        return i + 1

    # Helper function for performing quick sort
    async def sort(arr, low, high):
        nonlocal comparisons, arrayAccesses, swaps
        if low < high:
            pi = await partition(arr, low, high)
            
            # Recursively sort the subarrays before and after the partition
            await sort(arr, low, pi - 1)
            await sort(arr, pi + 1, high)

    # Perform quick sort
    await sort(arr, 0, len(arr) - 1)
    
    return arr, comparisons, arrayAccesses, swaps
