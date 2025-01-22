import asyncio
import random
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .utils.bubble_sort import bubble_sort
from .utils.selection_sort import selection_sort
from .utils.insertion_sort import insertion_sort
from .utils.merge_sort import merge_sort
from .utils.quick_sort import quick_sort
from .utils.heap_sort import heap_sort
from .utils.radix_sort import radix_sort
from .utils.polynomial_fit import polynomial_fit
import numpy as np
from scipy.optimize import curve_fit

class SortingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.array = []  # Initialize the array as empty
        self.originalArray = []
        self.sorting_task = None  # Task to keep track of the sorting process

    async def disconnect(self, close_code):
        print(f"Disconnected with code: {close_code}")
        if self.sorting_task and not self.sorting_task.done():
            self.sorting_task.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)

        if "action" in data:
            if data["action"] == "generate_array":
                size = data["size"]
                self.array = [random.randint(1, 200) for _ in range(int(size))]
                self.originalArray = self.array[:]
                await self.send(json.dumps({"array": self.array}))

            elif data["action"] == "reset":
                # Cancel the current sorting task if running
                if self.sorting_task and not self.sorting_task.done():
                    self.sorting_task.cancel()
                    self.sorting_task = None
                self.array = self.originalArray[:]
                await self.send(json.dumps({"reset": "reset", "array": self.originalArray}))

            elif data["action"] == "sort_array":
                # Perform sorting algorithm and send each step while sorting
                algorithm = data.get("algorithm")
                delay = data.get("delay")
                throttle = data.get("throttle")

                # Cancel any ongoing sorting process before starting a new one
                if self.sorting_task and not self.sorting_task.done():
                    self.sorting_task.cancel()

                # Start the new sorting process
                self.sorting_task = asyncio.create_task(self.perform_sort(self.array, algorithm, delay, throttle))

    async def perform_sort(self, arr, algorithm, delay, throttle):
        algorithms = {
            "bubble_sort": bubble_sort,
            "selection_sort": selection_sort,
            "insertion_sort": insertion_sort,
            "merge_sort": merge_sort,
            "quick_sort": quick_sort,
            "heap_sort": heap_sort,
            "radix_sort": radix_sort,
            # "shell_sort": shell_sort,
            # "counting_sort": counting_sort,
        }
        sort_function = algorithms.get(algorithm)
        if sort_function:
            try:
                await sort_function(arr, self.send_sort_data, delay, throttle)
                await self.send(json.dumps({"isSorted": True}))
            except asyncio.CancelledError:
                # Handle cancellation gracefully
                await self.send(json.dumps({"message": "Sorting process cancelled"}))

    async def send_sort_data(self, arr, comparisons, arrayAccesses, swaps, highlightedIndices):
        # Send the current state of the array to the frontend
        await self.send(json.dumps({
            "array": arr[:],
            "comparisons": comparisons,
            "arrayAccesses": arrayAccesses,
            "swaps": swaps,
            "highlightedIndices": highlightedIndices,
        }))



class FittingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        self.dataset = {"x": [], "y": []}  # Initialize dataset
        self.fitting_task = None          # Task to manage curve fitting
        self.fitting_result = None        # Store the final fitting result

    async def disconnect(self, close_code):
        print(f"Disconnected with code: {close_code}")
        if self.fitting_task and not self.fitting_task.done():
            self.fitting_task.cancel()

    async def receive(self, text_data):
        data = json.loads(text_data)

        if "action" in data:
            if data["action"] == "generate_dataset":
                x = np.linspace(0, 100, 50)
                y = 20 * np.sin(np.pi * 0.04 * x) + np.random.rand(50) * 10
                self.dataset = {"x": x.tolist(), "y": y.tolist()}
                print(f"dataset: {self.dataset}")
                await self.send(json.dumps({
                    "dataset": self.dataset,
                }))

            elif data["action"] == "start_fitting":
                method = data.get("method")
                degree = data.get("degree", 1)  # Default to linear fitting
                delay = data.get("delay", 0.1)

                # Cancel any ongoing fitting process
                if self.fitting_task and not self.fitting_task.done():
                    self.fitting_task.cancel()
                print(f"method: {method}")
                # Start the new fitting process
                self.fitting_task = asyncio.create_task(self.perform_fit(self.dataset, method, degree, delay))

            elif data["action"] == "reset":
                # Reset the dataset and cancel any ongoing fitting process
                if self.fitting_task and not self.fitting_task.done():
                    self.fitting_task.cancel()
                    self.fitting_task = None
                self.dataset = {"x": [], "y": []}
                self.fitting_result = None
                await self.send(json.dumps({"message": "Dataset reset"}))

    async def perform_fit(self, dataset, method, degree, delay):
        fitting_methods = {
            "polynomial": polynomial_fit,
            # You can add more fitting methods here, e.g., "linear": linear_fit
        }

        fit_function = fitting_methods.get(method)
        if not fit_function:
            await self.send(json.dumps({"error": f"Unknown fitting method: {method}"}))
            return

        try:
            # Call the selected fitting function
            final_coefficients = await fit_function(dataset, degree, self.send_fit_data, delay)
            
            if final_coefficients is not None:
                self.fitting_result = final_coefficients  # Store the result
                await self.send(json.dumps({"isFitted": True, "coefficients": final_coefficients.tolist()}))
            else:
                await self.send(json.dumps({"error": "Fitting process failed, no coefficients returned"}))

        except asyncio.CancelledError:
            # Handle cancellation gracefully
            await self.send(json.dumps({"message": "Fitting process cancelled"}))


    async def send_fit_data(self, progress, coefficients, mse, r_squared):
        # Send intermediate fitting data to the frontend
        await self.send(json.dumps({
            "progress": progress,
            "coefficients": coefficients,
            "mse": mse,
            "r_squared": r_squared,
        }))
