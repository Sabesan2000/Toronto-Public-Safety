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

The sample data mimics real crime patterns but is completely fictional.
\`\`\`

```python file="app.py"
"""
Toronto Public Safety Dashboard - Main Application

This file creates the web interface using Streamlit. It handles user interactions,
data filtering, and displays all the charts and metrics.
"""

import streamlit as st
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from data_processor import CrimeDataProcessor
import sqlite3
import os

# Configure the web page
st.set_page_config(
    page_title="Toronto Public Safety Reporting",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Initialize session state to remember user selections
if 'neighborhood' not in st.session_state:
    st.session_state.neighborhood = 'All Districts'
if 'crime_type' not in st.session_state:
    st.session_state.crime_type = 'All Types'
if 'date_range' not in st.session_state:
    st.session_state.date_range = '12months'
if 'filters_applied' not in st.session_state:
    st.session_state.filters_applied = False

# Set up database connection
@st.cache_resource
def init_data_processor():
    if not os.path.exists('toronto_crime.db'):
        st.error("Database not found. Please run setup_database.py first.")
        st.stop()
    return CrimeDataProcessor()

processor = init_data_processor()

# Toronto official colors
TORONTO_BLUE = "#003F7F"
TORONTO_LIGHT_BLUE = "#0066CC"
TORONTO_GRAY = "#666666"
TORONTO_LIGHT_GRAY = "#F5F5F5"

# Custom CSS styling
st.markdown(f"""
<style>
    #MainMenu {{visibility: hidden;}}
    footer {{visibility: hidden;}}
    header {{visibility: hidden;}}
    
    .main .block-container {{
        padding-top: 1rem;
        padding-bottom: 1rem;
        max-width: 1200px;
    }}
    
    .toronto-header {{
        background: linear-gradient(135deg, {TORONTO_BLUE} 0%, {TORONTO_LIGHT_BLUE} 100%);
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }}
    
    .toronto-header h1 {{
        margin: 0;
        font-size: 2.5rem;
        font-weight: 300;
        letter-spacing: 1px;
    }}
    
    .toronto-header p {{
        margin: 0.5rem 0 0 0;
        font-size: 1.1rem;
        opacity: 0.9;
    }}
    
    .filter-section {{
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #E0E0E0;
        margin-bottom: 2rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }}
    
    .filter-title {{
        color: {TORONTO_BLUE};
        font-size: 1.3rem;
        font-weight: 600;
        margin-bottom: 1rem;
        border-bottom: 2px solid {TORONTO_LIGHT_BLUE};
        padding-bottom: 0.5rem;
    }}
    
    .metric-container {{
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border-left: 4px solid {TORONTO_BLUE};
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        margin-bottom: 1rem;
    }}
    
    .metric-value {{
        font-size: 2rem;
        font-weight: 700;
        color: {TORONTO_BLUE};
        margin: 0;
    }}
    
    .metric-label {{
        font-size: 0.9rem;
        color: {TORONTO_GRAY};
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin: 0;
    }}
    
    .metric-delta {{
        font-size: 0.8rem;
        margin-top: 0.25rem;
    }}
    
    .chart-container {{
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #E0E0E0;
        margin-bottom: 1.5rem;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }}
    
    .chart-title {{
        color: {TORONTO_BLUE};
        font-size: 1.2rem;
        font-weight: 600;
        margin-bottom: 1rem;
        text-align: center;
    }}
    
    .stTabs [data-baseweb="tab-list"] {{
        gap: 2px;
        background-color: {TORONTO_LIGHT_GRAY};
        border-radius: 8px;
        padding: 4px;
    }}
    
    .stTabs [data-baseweb="tab"] {{
        background-color: transparent;
        border-radius: 6px;
        color: {TORONTO_GRAY};
        font-weight: 500;
    }}
    
    .stTabs [aria-selected="true"] {{
        background-color: {TORONTO_BLUE} !important;
        color: white !important;
    }}
    
    .stButton > button {{
        background-color: {TORONTO_BLUE};
        color: white;
        border: none;
        border-radius: 6px;
        padding: 0.5rem 2rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
    }}
    
    .stButton > button:hover {{
        background-color: {TORONTO_LIGHT_BLUE};
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }}
    
    .stSelectbox > div > div {{
        border: 1px solid #D0D0D0;
        border-radius: 6px;
    }}
    
    .toronto-footer {{
        background-color: {TORONTO_BLUE};
        color: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        margin-top: 3rem;
    }}
    
    .toronto-footer p {{
        margin: 0.25rem 0;
        opacity: 0.9;
    }}
</style>
""", unsafe_allow_html=True)

# Header section
col1, col2 = st.columns([1, 4])
with col1:
    st.image("assets/tpsr-logo.jpg", width=200)
with col2:
    st.markdown("""
    <div class="toronto-header">
        <h1>Public Safety Analytics Dashboard</h1>
        <p>Official Crime Statistics and Emergency Response Analysis</p>
    </div>
    """, unsafe_allow_html=True)

# Filter controls
st.markdown('<div class="filter-section">', unsafe_allow_html=True)
st.markdown('<div class="filter-title">📊 Data Analysis Parameters</div>', unsafe_allow_html=True)

col1, col2, col3, col4 = st.columns([2, 2, 2, 1])

neighborhoods = ['All Districts', 'Downtown Core', 'Scarborough', 'North York', 'Etobicoke', 'East York', 'York', 'Old Toronto']
crime_types = ['All Types', 'Auto Theft', 'Drug Offenses', 'Assault', 'Break & Enter', 'Robbery', 'Fraud', 'Vandalism']
date_ranges = {
    'Last 3 Months': '3months',
    'Last 6 Months': '6months', 
    'Last 12 Months': '12months',
    'Last 24 Months': '24months'
}

with col1:
    neighborhood_selection = st.selectbox(
        "District/Neighborhood",
        neighborhoods,
        index=neighborhoods.index(st.session_state.neighborhood)
    )

with col2:
    crime_type_selection = st.selectbox(
        "Incident Type",
        crime_types,
        index=crime_types.index(st.session_state.crime_type)
    )

with col3:
    date_range_selection = st.selectbox(
        "Analysis Period",
        list(date_ranges.keys()),
        index=list(date_ranges.values()).index(st.session_state.date_range)
    )

with col4:
    st.markdown("<br>", unsafe_allow_html=True)
    # This button updates the dashboard with new filter selections
    if st.button("🔄 Update Analysis", type="primary"):
        st.session_state.neighborhood = neighborhood_selection
        st.session_state.crime_type = crime_type_selection
        st.session_state.date_range = date_ranges[date_range_selection]
        st.session_state.filters_applied = True
        st.rerun()

st.markdown('</div>', unsafe_allow_html=True)

# Data loading functions - cached for performance
@st.cache_data
def load_safety_metrics(neighborhood, crime_type, date_range):
    return processor.get_safety_metrics(neighborhood, crime_type, date_range)

@st.cache_data
def load_neighborhood_comparison(crime_type, date_range):
    return processor.get_neighborhood_comparison(crime_type, date_range)

@st.cache_data
def load_monthly_trends(neighborhood, crime_type, date_range):
    return processor.get_monthly_trends(neighborhood, crime_type, date_range)

@st.cache_data
def load_crime_distribution(neighborhood, date_range):
    return processor.get_crime_type_distribution(neighborhood, date_range)

@st.cache_data
def load_response_analysis(neighborhood, date_range):
    return processor.get_response_time_analysis(neighborhood, date_range)

# Load current data
metrics = load_safety_metrics(st.session_state.neighborhood, st.session_state.crime_type, st.session_state.date_range)

# Key Performance Indicators
st.markdown("## 📈 Key Performance Indicators")

col1, col2, col3, col4 = st.columns(4)

with col1:
    change_indicator = "↓" if metrics['change_percent'] &lt; 0 else "↑"
    change_color = "#10B981" if metrics['change_percent'] &lt; 0 else "#EF4444"
    st.markdown(f"""
    <div class="metric-container">
        <p class="metric-label">Total Incidents</p>
        <p class="metric-value">{metrics['total_incidents']:,}</p>
        <p class="metric-delta" style="color: {change_color};">
            {change_indicator} {abs(metrics['change_percent']):.1f}% vs previous period
        </p>
    </div>
    """, unsafe_allow_html=True)

with col2:
    response_indicator = "↓" if metrics['response_change'] &lt; 0 else "↑"
    response_color = "#10B981" if metrics['response_change'] &lt; 0 else "#EF4444"
    st.markdown(f"""
    <div class="metric-container">
        <p class="metric-label">Average Response Time</p>
        <p class="metric-value">{metrics['avg_response_time']:.1f} min</p>
        <p class="metric-delta" style="color: {response_color};">
            {response_indicator} {abs(metrics['response_change']):.1f}% vs previous period
        </p>
    </div>
    """, unsafe_allow_html=True)

with col3:
    st.markdown(f"""
    <div class="metric-container">
        <p class="metric-label">High-Priority Districts</p>
        <p class="metric-value">{metrics['high_risk_areas']}</p>
        <p class="metric-delta" style="color: {TORONTO_GRAY};">
            Requiring enhanced monitoring
        </p>
    </div>
    """, unsafe_allow_html=True)

with col4:
    safety_color = "#10B981" if metrics['safety_score'] >= 7 else "#F59E0B"
    safety_status = "Satisfactory" if metrics['safety_score'] >= 7 else "Needs Attention"
    st.markdown(f"""
    <div class="metric-container">
        <p class="metric-label">Safety Index</p>
        <p class="metric-value">{metrics['safety_score']:.1f}/10</p>
        <p class="metric-delta" style="color: {safety_color};">
            Status: {safety_status}
        </p>
    </div>
    """, unsafe_allow_html=True)

# Analysis tabs
st.markdown("## 📊 Detailed Analysis")

tab1, tab2, tab3, tab4 = st.tabs([
    "📋 Executive Summary", 
    "🗺️ District Analysis", 
    "⏱️ Response Performance", 
    "📈 Trend Analysis"
])

TORONTO_COLORS = [TORONTO_BLUE, TORONTO_LIGHT_BLUE, "#0080FF", "#4D94FF", "#80B3FF", "#B3D1FF", "#E6F0FF"]

# Tab 1: Executive Summary
with tab1:
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.markdown('<div class="chart-title">Incident Type Distribution</div>', unsafe_allow_html=True)
        
        crime_dist = load_crime_distribution(st.session_state.neighborhood, st.session_state.date_range)
        
        fig_pie = px.pie(
            crime_dist, 
            values='count', 
            names='crime_type',
            color_discrete_sequence=TORONTO_COLORS
        )
        fig_pie.update_traces(
            textposition='inside', 
            textinfo='percent+label',
            textfont_size=12
        )
        fig_pie.update_layout(
            showlegend=True,
            legend=dict(orientation="v", yanchor="middle", y=0.5, xanchor="left", x=1.05),
            margin=dict(l=20, r=20, t=20, b=20),
            font=dict(family="Arial", size=12, color=TORONTO_BLUE)
        )
        st.plotly_chart(fig_pie, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.markdown('<div class="chart-title">Priority Classifications</div>', unsafe_allow_html=True)
        
        # Classify crimes by priority level
        priority_data = []
        for _, row in crime_dist.iterrows():
            if row['crime_type'] in ['Auto Theft', 'Drug Offenses']:
                priority = 'High Priority'
                color = '#EF4444'
            elif row['crime_type'] in ['Break & Enter', 'Fraud', 'Assault']:
                priority = 'Medium Priority'
                color = '#F59E0B'
            else:
                priority = 'Standard Priority'
                color = '#10B981'
            
            priority_data.append({
                'Crime Type': row['crime_type'],
                'Count': row['count'],
                'Percentage': row['percentage'],
                'Priority': priority,
                'Color': color
            })
        
        priority_df = pd.DataFrame(priority_data)
        
        for priority in ['High Priority', 'Medium Priority', 'Standard Priority']:
            subset = priority_df[priority_df['Priority'] == priority]
            if not subset.empty:
                color = subset.iloc[0]['Color']
                st.markdown(f"""
                <div style="border-left: 4px solid {color}; padding-left: 1rem; margin-bottom: 1rem;">
                    <h4 style="color: {color}; margin: 0;">{priority}</h4>
                """, unsafe_allow_html=True)
                
                for _, row in subset.iterrows():
                    st.markdown(f"• **{row['Crime Type']}**: {row['Count']} incidents ({row['Percentage']:.1f}%)")
                
                st.markdown("</div>", unsafe_allow_html=True)
        
        st.markdown('</div>', unsafe_allow_html=True)

# Tab 2: District Analysis
with tab2:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown('<div class="chart-title">District Performance Comparison</div>', unsafe_allow_html=True)
    
    neighborhood_data = load_neighborhood_comparison(st.session_state.crime_type, st.session_state.date_range)
    
    color_map = {'Low': '#10B981', 'Medium': '#F59E0B', 'High': '#EF4444'}
    
    fig_bar = px.bar(
        neighborhood_data,
        x='neighborhood',
        y='incidents',
        color='risk_level',
        color_discrete_map=color_map,
        title=f"Incident Count by District - {st.session_state.crime_type}",
        labels={'incidents': 'Number of Incidents', 'neighborhood': 'District'}
    )
    fig_bar.update_layout(
        xaxis_tickangle=-45,
        font=dict(family="Arial", size=12, color=TORONTO_BLUE),
        plot_bgcolor='white',
        paper_bgcolor='white'
    )
    st.plotly_chart(fig_bar, use_container_width=True)
    
    st.markdown("**Risk Classification Criteria:**")
    col1, col2, col3 = st.columns(3)
    with col1:
        st.markdown("🔴 **High Risk**: >300 incidents")
    with col2:
        st.markdown("🟡 **Medium Risk**: 150-300 incidents")
    with col3:
        st.markdown("🟢 **Low Risk**: &lt;150 incidents")
    
    st.markdown('</div>', unsafe_allow_html=True)

# Tab 3: Response Performance
with tab3:
    monthly_response, neighborhood_response = load_response_analysis(st.session_state.neighborhood, st.session_state.date_range)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.markdown('<div class="chart-title">Monthly Response Time Trends</div>', unsafe_allow_html=True)
        
        fig_line = px.line(
            monthly_response,
            x='year_month',
            y='response_time_minutes',
            line_shape='spline',
            color_discrete_sequence=[TORONTO_BLUE]
        )
        fig_line.add_hline(
            y=8.0, 
            line_dash="dash", 
            line_color="#EF4444",
            annotation_text="8-minute target",
            annotation_position="top right"
        )
        fig_line.update_layout(
            xaxis_title="Month",
            yaxis_title="Response Time (minutes)",
            font=dict(family="Arial", size=12, color=TORONTO_BLUE),
            plot_bgcolor='white',
            paper_bgcolor='white'
        )
        st.plotly_chart(fig_line, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="chart-container">', unsafe_allow_html=True)
        st.markdown('<div class="chart-title">District Response Performance</div>', unsafe_allow_html=True)
        
        fig_bar_response = px.bar(
            neighborhood_response,
            x='neighborhood',
            y='response_time_minutes',
            color_discrete_sequence=[TORONTO_LIGHT_BLUE]
        )
        fig_bar_response.add_hline(
            y=8.0, 
            line_dash="dash", 
            line_color="#EF4444",
            annotation_text="Target: 8 min",
            annotation_position="top right"
        )
        fig_bar_response.update_layout(
            xaxis_tickangle=-45,
            xaxis_title="District",
            yaxis_title="Response Time (minutes)",
            font=dict(family="Arial", size=12, color=TORONTO_BLUE),
            plot_bgcolor='white',
            paper_bgcolor='white'
        )
        st.plotly_chart(fig_bar_response, use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

# Tab 4: Trend Analysis
with tab4:
    st.markdown('<div class="chart-container">', unsafe_allow_html=True)
    st.markdown('<div class="chart-title">Incident Trend Analysis</div>', unsafe_allow_html=True)
    
    trend_data = load_monthly_trends(st.session_state.neighborhood, st.session_state.crime_type, st.session_state.date_range)
    
    fig_area = px.area(
        trend_data,
        x='year_month',
        y='incidents',
        color_discrete_sequence=[TORONTO_LIGHT_BLUE]
    )
    fig_area.update_layout(
        xaxis_tickangle=-45,
        xaxis_title="Month",
        yaxis_title="Number of Incidents",
        font=dict(family="Arial", size=12, color=TORONTO_BLUE),
        plot_bgcolor='white',
        paper_bgcolor='white'
    )
    st.plotly_chart(fig_area, use_container_width=True)
    
    # Statistical summary
    if len(trend_data) > 0:
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("**Statistical Summary**")
            avg_incidents = trend_data['incidents'].mean()
            max_incidents = trend_data['incidents'].max()
            min_incidents = trend_data['incidents'].min()
            
            st.markdown(f"• **Average**: {avg_incidents:.1f} incidents/month")
            st.markdown(f"• **Peak**: {max_incidents} incidents")
            st.markdown(f"• **Minimum**: {min_incidents} incidents")
        
        with col2:
            st.markdown("**Seasonal Patterns**")
            recent_trend = trend_data.tail(3)['incidents'].mean()
            overall_avg = trend_data['incidents'].mean()
            
            if recent_trend > overall_avg * 1.1:
                st.markdown("⚠️ **Recent Trend**: Increasing incidents")
            elif recent_trend &lt; overall_avg * 0.9:
                st.markdown("✅ **Recent Trend**: Decreasing incidents")
            else:
                st.markdown("📊 **Recent Trend**: Stable pattern")
    
    st.markdown('</div>', unsafe_allow_html=True)

# Footer
st.markdown(f"""
<div class="toronto-footer">
    <p><strong>Toronto Public Safety Reporting System</strong></p>
    <p>Data Source: Toronto Police Service (TPS) • Toronto Emergency Medical Services</p>
    <p>Last Updated: {pd.Timestamp.now().strftime('%B %d, %Y at %I:%M %p')}</p>
    <p>© 2024 City of Toronto. All rights reserved.</p>
</div>
""", unsafe_allow_html=True)
