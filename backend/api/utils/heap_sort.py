import asyncio


async def heap_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    highlighted_indices = []

    
    async def heapify(arr, n, i):
        nonlocal comparisons, arrayAccesses, swaps, highlighted_indices
        largest = i  
        left = 2 * i + 1  
        right = 2 * i + 2  

        
        if left < n and arr[left] > arr[largest]:
            largest = left

        
        if right < n and arr[right] > arr[largest]:
            largest = right

        
        if largest != i:
            highlighted_indices = [i, largest]
            arr[i], arr[largest] = arr[largest], arr[i]  
            arrayAccesses += 4
            swaps += 2

            
            await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
            await asyncio.sleep(delay)  

            await heapify(arr, n, largest)  
    n = len(arr)    
    for i in range(n // 2 - 1, -1, -1):
        await heapify(arr, n, i)

    
    for i in range(n-1, 0, -1):
        
        highlighted_indices = [0, i]
        arr[i], arr[0] = arr[0], arr[i]  
        arrayAccesses += 4
        swaps += 2
        
        await send_fn(arr, comparisons, arrayAccesses, swaps, highlighted_indices)
        await asyncio.sleep(delay)  

        await heapify(arr, i, 0)

    return arr, comparisons, arrayAccesses, swaps
