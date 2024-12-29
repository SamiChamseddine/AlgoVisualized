# Step 1: Build the frontend (React + Vite)
FROM node:18 AS build

WORKDIR /app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Build the React app (Vite)
RUN npm run build

# Step 2: Set up the backend (Django)
FROM python:3.10-slim AS backend

# Install dependencies for Django
WORKDIR /app/backend
COPY backend/requirements.txt ./
RUN pip install -r requirements.txt

# Copy the Django project files
COPY backend/ .

# Copy the built React frontend from the build step
COPY --from=build /app/frontend/dist /app/backend/static

# Expose port for Django backend
EXPOSE 8000

# Set the environment variable for production
ENV DJANGO_SETTINGS_MODULE=backend.settings.production

# Start the Django application with Gunicorn
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
