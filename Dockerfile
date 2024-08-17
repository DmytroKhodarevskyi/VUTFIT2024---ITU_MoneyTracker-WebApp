# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /MoneyTracker

# Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Install the dependencies specified in the requirements.txt file
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the rest of the application code into the container (after the Django project is created)
COPY . .

# Set the entrypoint to use Django's manage.py by default
ENTRYPOINT ["python", "manage.py"]
