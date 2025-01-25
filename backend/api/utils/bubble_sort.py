# utils/sorting.py
import asyncio


async def bubble_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    steps = 0
    batchsize = 0
    highlighted_indices = []
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            highlighted_indices = [j, j + 1]
            comparisons += 1
            arrayAccesses += 2
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]  
                arrayAccesses += 4
                swaps += 2
            steps+=1
            if steps >=batchsize:
                await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
                await asyncio.sleep(delay)
                steps = 0 

    return arr, comparisons, arrayAccesses, swaps
