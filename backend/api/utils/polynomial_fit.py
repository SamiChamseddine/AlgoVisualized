import numpy as np
import asyncio

async def polynomial_fit(dataset, degree, send_fn, delay=0.1, throttle=1):
    """
    Fits a polynomial to the dataset using the least squares method.
    Args:
        dataset (dict): {"x": [..], "y": [..]} input data.
        degree (int): Degree of the polynomial.
        send_fn (coroutine): Callback to send intermediate results.
        delay (float): Visualization delay.
        throttle (int): Frequency of sending updates.
    """
    x = np.array(dataset["x"])
    y = np.array(dataset["y"])
    n = len(x)
    progress = 0

    # Build the design matrix for polynomial regression
    X = np.vander(x, degree + 1)

    for step in range(1, n + 1):
        # Subset of the design matrix and y values for step-wise fitting
        X_partial = X[:step]
        y_partial = y[:step]

        # Compute the coefficients (polynomial fitting)
        coefficients, _, _, _ = np.linalg.lstsq(X_partial, y_partial, rcond=None)

        # Calculate predictions using the current coefficients
        y_pred = np.dot(X_partial, coefficients)

        # Calculate the Mean Squared Error (MSE) as the loss function
        mse = np.mean((y_partial - y_pred) ** 2)
        range_y = np.max(y_partial) - np.min(y_partial)
        mse = mse / (range_y ** 2) if range_y != 0 else 0

        # Calculate the current progress percentage
        progress = int((step / n) * 100)

        # Calculate R-squared value (optional, for model fit quality)
        ss_total = np.sum((y_partial - np.mean(y_partial)) ** 2)
        ss_residual = np.sum((y_partial - y_pred) ** 2)
        r_squared = 1 - (ss_residual / ss_total) if ss_total != 0 else 0
        
        # Send all relevant data to the frontend
        if step % throttle == 0:
            await send_fn(
                progress,
                coefficients.tolist(),
                round(mse, 2),
                round(r_squared, 2),
            )
            await asyncio.sleep(delay)  # Add delay for visualization
        print(f"r_squared: {round(r_squared, 2)}, mse: {round(mse, 2)}")


    # Return the final coefficients

    return coefficients
