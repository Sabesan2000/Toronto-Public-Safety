#!/bin/bash

# Setup database if it doesn't exist
if [ ! -f "toronto_crime.db" ]; then
    echo "Setting up database..."
    python scripts/setup_database.py
fi

# Run the Streamlit app
echo "Starting Toronto Public Safety Dashboard..."
streamlit run app.py --server.port 8501 --server.address 0.0.0.0
