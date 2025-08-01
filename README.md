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
