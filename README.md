# Toronto Public Safety Dashboard

A data visualization tool for analyzing crime patterns and emergency response times across Toronto neighborhoods.

## About This Project

Built this dashboard to learn Streamlit while creating something useful for public safety analysis. It processes crime data and presents it through interactive charts and filters.

## Features

- **Interactive Filters**: Select neighborhoods, crime types, and date ranges
- **Key Metrics**: Track incidents, response times, and safety scores
- **Multiple Views**: Executive summary, district comparison, response analysis, and trends
- **Toronto Branding**: Official city colors and professional styling

## Tech Stack

- **Streamlit**: Web interface
- **Python/Pandas**: Data processing
- **Plotly**: Interactive charts
- **SQLite**: Database storage

## Setup

1. Install requirements:
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

2. Create the database:
   \`\`\`bash
   python scripts/setup_database.py
   \`\`\`

3. Run the dashboard:
   \`\`\`bash
   streamlit run app.py
   \`\`\`

## Data

Uses 5,000+ sample crime incidents with realistic patterns:
- 7 Toronto districts
- 7 crime types
- 24 months of data
- Seasonal variations

## Learning Streamlit

This project helped me understand:
- Building interactive web apps with Python
- Managing user state and filters
- Integrating databases with web interfaces
- Creating professional dashboards


