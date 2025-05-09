#!/bin/bash

# Marketing AI Platform Setup Script
# This script installs and configures the core components of the Marketing AI Platform

echo "=== Digital Marketing Agentic AI Platform Setup ==="
echo "This script will install and configure the necessary components."
echo ""

# Check for required commands
command -v docker >/dev/null 2>&1 || { echo "Docker is required but not installed. Please install Docker first."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed. Please install Python 3 first."; exit 1; }
command -v pip3 >/dev/null 2>&1 || { echo "pip3 is required but not installed. Please install pip3 first."; exit 1; }

# Create data directory
echo "Creating data directories..."
mkdir -p data/postgres
mkdir -p data/weaviate
mkdir -p data/n8n
mkdir -p data/reports
mkdir -p data/marketing_docs

# Setup environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOF
# Database Connection
DB_CONNECTION=postgresql://postgres:marketingai@localhost:5432/marketing_ai

# Vector DB Connection
WEAVIATE_URL=http://localhost:8080
WEAVIATE_API_KEY=

# n8n Config
N8N_URL=http://localhost:5678
N8N_API_KEY=

# LLM Settings
LLM_MODEL_PATH=mistral
LLM_BACKEND=ollama
EOF
    echo ".env file created."
else
    echo ".env file already exists, skipping."
fi

# Setup Docker Compose file
echo "Creating Docker Compose file..."
cat > docker-compose.yml << EOF
version: '3'
services:
  postgres:
    image: postgres:15
    container_name: marketing-ai-postgres
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: marketingai
      POSTGRES_USER: postgres
      POSTGRES_DB: marketing_ai
    volumes:
      - ./data/postgres:/var/lib/postgresql/data

  weaviate:
    image: semitechnologies/weaviate:1.21.2
    container_name: marketing-ai-weaviate
    restart: always
    ports:
      - "8080:8080"
    environment:
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: "true"
      PERSISTENCE_DATA_PATH: "/var/lib/weaviate"
      DEFAULT_VECTORIZER_MODULE: "text2vec-transformers"
      ENABLE_MODULES: "text2vec-transformers"
      TRANSFORMERS_INFERENCE_API: "http://t2v-transformers:8080"
    volumes:
      - ./data/weaviate:/var/lib/weaviate
    depends_on:
      - t2v-transformers

  t2v-transformers:
    image: semitechnologies/transformers-inference:sentence-transformers-all-MiniLM-L6-v2
    container_name: marketing-ai-transformers
    restart: always
    environment:
      ENABLE_CUDA: "0"

  n8n:
    image: n8nio/n8n
    container_name: marketing-ai-n8n
    restart: always
    ports:
      - "5678:5678"
    volumes:
      - ./data/n8n:/home/node/.n8n
    environment:
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_HOST=localhost
      - NODE_ENV=production
      - N8N_ENCRYPTION_KEY=marketing-ai-platform-key

  superset:
    image: apache/superset
    container_name: marketing-ai-superset
    restart: always
    ports:
      - "8088:8088"
    environment:
      SUPERSET_SECRET_KEY: marketing-ai-superset-key
    volumes:
      - ./superset_config.py:/app/pythonpath/superset_config.py
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8088/health"]
      interval: 10s
      timeout: 30s
      retries: 5
EOF
echo "Docker Compose file created."

# Create superset_config.py
echo "Creating Superset config file..."
mkdir -p ./superset
cat > ./superset_config.py << EOF
import os

SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:marketingai@postgres:5432/marketing_ai'
SQLALCHEMY_TRACK_MODIFICATIONS = True
SECRET_KEY = 'marketing-ai-superset-key'

# Flask-WTF flag for CSRF
WTF_CSRF_ENABLED = True
# Add endpoints that need to be exempt from CSRF protection
WTF_CSRF_EXEMPT_LIST = []
# A CSRF token that expires in 1 year
WTF_CSRF_TIME_LIMIT = 60 * 60 * 24 * 365

# Set this API key to enable Mapbox visualizations
MAPBOX_API_KEY = os.environ.get('MAPBOX_API_KEY', '')
EOF
echo "Superset config file created."

# Install Ollama (if not installed)
echo "Checking for Ollama installation..."
if ! command -v ollama &> /dev/null; then
    echo "Installing Ollama..."
    curl -fsSL https://ollama.com/install.sh | sh
    echo "Ollama installed."
else
    echo "Ollama already installed, skipping."
fi

# Install required Python packages
echo "Installing required Python packages..."
pip3 install -r requirements.txt

# Pull Mistral model for Ollama
echo "Pulling Mistral model for Ollama..."
ollama pull mistral

# Setup complete
echo ""
echo "=== Setup Complete ==="
echo ""
echo "To start the services, run: docker-compose up -d"
echo "This will start PostgreSQL, Weaviate, n8n, and Superset"
echo ""
echo "Once services are running, initialize the knowledge base with:"
echo "python scripts/init_marketing_rag.py --data-path ./data/marketing_docs"
echo ""
echo "Import the example workflow templates to n8n at: http://localhost:5678"
echo "- Navigate to Workflows > Import from file"
echo "- Import files from the workflows/ directory"
echo ""
echo "Start using the Marketing AI Platform!"
echo "=========================================="