import asyncio

async def merge(arr, left, middle, right, send_fn, delay, throttle, stats):
    comparisons, arrayAccesses, swaps = stats
    n1 = middle - left + 1
    n2 = right - middle

    L = arr[left:middle + 1]
    R = arr[middle + 1:right + 1]
    arrayAccesses += n1 + n2

    i = j = 0  
    k = left  

    while i < n1 and j < n2:
        comparisons += 1
        arrayAccesses += 2
        if L[i] <= R[j]:
            arr[k] = L[i]
            i += 1
        else:
            arr[k] = R[j]
            j += 1
            swaps += 1
        k += 1
        arrayAccesses += 1

        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    while i < n1:
        arr[k] = L[i]
        i += 1
        k += 1
        arrayAccesses += 1

        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    while j < n2:
        arr[k] = R[j]
        j += 1
        k += 1
        arrayAccesses += 1

        if k % throttle == 0:
            await send_fn(arr, comparisons, arrayAccesses, swaps, [k])
            await asyncio.sleep(delay)

    stats[0], stats[1], stats[2] = comparisons, arrayAccesses, swaps


async def merge_sort_recursive(arr, left, right, send_fn, delay, throttle, stats):
    if left < right:
        middle = (left + right) // 2

        await merge_sort_recursive(arr, left, middle, send_fn, delay, throttle, stats)
        await merge_sort_recursive(arr, middle + 1, right, send_fn, delay, throttle, stats)

        await merge(arr, left, middle, right, send_fn, delay, throttle, stats)


async def merge_sort(arr, send_fn, delay, throttle):
    comparisons = 0
    arrayAccesses = 0
    swaps = 0
    stats = [comparisons, arrayAccesses, swaps]

    await merge_sort_recursive(arr, 0, len(arr) - 1, send_fn, delay, throttle, stats)

    comparisons, arrayAccesses, swaps = stats
    return arr, comparisons, arrayAccesses, swaps
