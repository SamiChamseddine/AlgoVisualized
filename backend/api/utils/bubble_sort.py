# utils/sorting.py
import asyncio

# Async Bubble Sort Algorithm
async def bubble_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            highlighted_indices = [j, j + 1]
            comparisons += 1
            arrayAccesses += 2
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]  # Swap
                arrayAccesses += 4
                swaps += 2

            # Send the data after each iteration (allow visualization update)
            if i % throttle == 0:
                await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
                await asyncio.sleep(delay)  # Delay for visualization (non-blocking)

    return arr, comparisons, arrayAccesses, swaps
