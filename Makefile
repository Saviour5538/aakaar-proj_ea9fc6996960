# Makefile for PaperPalLite

.PHONY: install dev build test docker-up docker-down clean

install:
	@echo "Installing backend dependencies..."
	pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

dev:
	@echo "Starting development environment..."
	./scripts/dev.sh

build:
	@echo "Building frontend for production..."
	cd frontend && npm run build
	@echo "Building backend Docker image..."
	docker build -t paperpal-backend -f Dockerfile.backend .

test:
	@echo "Running backend tests..."
	pytest
	@echo "Running frontend tests..."
	cd frontend && npm test

docker-up:
	@echo "Starting Docker containers..."
	docker-compose up -d

docker-down:
	@echo "Stopping Docker containers..."
	docker-compose down

clean:
	@echo "Cleaning up..."
	rm -rf frontend/node_modules
	rm -rf frontend/dist
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete