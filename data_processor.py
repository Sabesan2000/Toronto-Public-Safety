import sqlite3
import pandas as pd
from datetime import datetime, timedelta

class CrimeDataProcessor:
    """
    Handles all database queries and data analysis for the crime dashboard.
    This class connects to the SQLite database and processes crime data
    based on user filter selections.
    """
    
    def __init__(self, db_path='toronto_crime.db'):
        self.db_path = db_path
    
    def get_connection(self):
        """Create database connection"""
        return sqlite3.connect(self.db_path)
    
    def get_filtered_data(self, neighborhood='All Districts', crime_type='All Types', date_range='12months'):
        """
        Get crime data based on user filter selections.
        Returns pandas DataFrame with matching records.
        """
        conn = self.get_connection()
        
        # Calculate date range
        end_date = datetime.now()
        if date_range == '3months':
            start_date = end_date - timedelta(days=90)
        elif date_range == '6months':
            start_date = end_date - timedelta(days=180)
        elif date_range == '12months':
            start_date = end_date - timedelta(days=365)
        else:  # 24months
            start_date = end_date - timedelta(days=730)
        
        # Build SQL query with filters
        query = """
        SELECT * FROM crime_incidents 
        WHERE incident_date >= ? AND incident_date <= ?
        """
        params = [start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')]
        
        if neighborhood != 'All Districts':
            query += " AND neighborhood = ?"
            params.append(neighborhood)
        
        if crime_type != 'All Types':
            query += " AND crime_type = ?"
            params.append(crime_type)
        
        df = pd.read_sql_query(query, conn, params=params)
        conn.close()
        
        if not df.empty:
            df['incident_date'] = pd.to_datetime(df['incident_date'])
        return df
    
    def get_neighborhood_comparison(self, crime_type='All Types', date_range='12months'):
        """Compare crime statistics across neighborhoods"""
        df = self.get_filtered_data('All Districts', crime_type, date_range)
        
        if df.empty:
            return pd.DataFrame(columns=['neighborhood', 'incidents', 'avg_response_time', 'risk_level'])
        
        # Group by neighborhood and calculate stats
        comparison = df.groupby('neighborhood').agg({
            'id': 'count',
            'response_time_minutes': 'mean'
        }).round(1)
        
        comparison.columns = ['incidents', 'avg_response_time']
        comparison = comparison.reset_index()
        
        # Add risk level classification
        comparison['risk_level'] = pd.cut(
            comparison['incidents'], 
            bins=[0, 150, 300, float('inf')], 
            labels=['Low', 'Medium', 'High']
        )
        
        return comparison
    
    def get_monthly_trends(self, neighborhood='All Districts', crime_type='All Types', date_range='12months'):
        """Get monthly crime trends over time"""
        df = self.get_filtered_data(neighborhood, crime_type, date_range)
        
        if df.empty:
            return pd.DataFrame(columns=['year_month', 'incidents'])
        
        df['year_month'] = df['incident_date'].dt.to_period('M')
        monthly_trends = df.groupby('year_month').size().reset_index(name='incidents')
        monthly_trends['year_month'] = monthly_trends['year_month'].astype(str)
        
        return monthly_trends
    
    def get_crime_type_distribution(self, neighborhood='All Districts', date_range='12months'):
        """Get breakdown of crime types by percentage"""
        df = self.get_filtered_data(neighborhood, 'All Types', date_range)
        
        if df.empty:
            return pd.DataFrame(columns=['crime_type', 'count', 'percentage'])
        
        distribution = df['crime_type'].value_counts().reset_index()
        distribution.columns = ['crime_type', 'count']
        distribution['percentage'] = (distribution['count'] / distribution['count'].sum() * 100).round(1)
        
        return distribution
    
    def get_response_time_analysis(self, neighborhood='All Districts', date_range='12months'):
        """Analyze emergency response times by month and neighborhood"""
        df = self.get_filtered_data(neighborhood, 'All Types', date_range)
        
        if df.empty:
            return pd.DataFrame(columns=['year_month', 'response_time_minutes']), pd.DataFrame(columns=['neighborhood', 'response_time_minutes', 'target'])
        
        # Monthly response times
        df['year_month'] = df['incident_date'].dt.to_period('M')
        monthly_response = df.groupby('year_month')['response_time_minutes'].mean().reset_index()
        monthly_response['year_month'] = monthly_response['year_month'].astype(str)
        monthly_response['response_time_minutes'] = monthly_response['response_time_minutes'].round(1)
        
        # Response times by neighborhood
        neighborhood_response = df.groupby('neighborhood')['response_time_minutes'].mean().reset_index()
        neighborhood_response['response_time_minutes'] = neighborhood_response['response_time_minutes'].round(1)
        neighborhood_response['target'] = 8.0  # 8-minute target
        
        return monthly_response, neighborhood_response
    
    def get_safety_metrics(self, neighborhood='All Districts', crime_type='All Types', date_range='12months'):
        """Calculate key performance indicators for the dashboard"""
        current_df = self.get_filtered_data(neighborhood, crime_type, date_range)
        
        # Get previous period for comparison
        if date_range == '3months':
            prev_days = 90
        elif date_range == '6months':
            prev_days = 180
        elif date_range == '12months':
            prev_days = 365
        else:
            prev_days = 730
        
        # Query previous period data
        end_date = datetime.now() - timedelta(days=prev_days)
        start_date = end_date - timedelta(days=prev_days)
        
        conn = self.get_connection()
        prev_query = """
        SELECT * FROM crime_incidents 
        WHERE incident_date >= ? AND incident_date <= ?
        """
        prev_params = [start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')]
        
        if neighborhood != 'All Districts':
            prev_query += " AND neighborhood = ?"
            prev_params.append(neighborhood)
        
        if crime_type != 'All Types':
            prev_query += " AND crime_type = ?"
            prev_params.append(crime_type)
        
        prev_df = pd.read_sql_query(prev_query, conn, params=prev_params)
        conn.close()
        
        # Calculate metrics
        total_incidents = len(current_df)
        prev_incidents = len(prev_df)
        change_percent = ((total_incidents - prev_incidents) / max(prev_incidents, 1) * 100) if prev_incidents > 0 else 0
        
        avg_response_time = current_df['response_time_minutes'].mean() if len(current_df) > 0 else 0
        prev_response_time = prev_df['response_time_minutes'].mean() if len(prev_df) > 0 else 0
        response_change = ((avg_response_time - prev_response_time) / max(prev_response_time, 1) * 100) if prev_response_time > 0 else 0
        
        high_risk_areas = len(self.get_neighborhood_comparison(crime_type, date_range).query('risk_level == "High"'))
        
        # Safety score calculation (0-10 scale)
        safety_score = max(0, 10 - (total_incidents / 100) - (avg_response_time / 2))
        safety_score = min(10, safety_score)
        
        return {
            'total_incidents': total_incidents,
            'change_percent': round(change_percent, 1),
            'avg_response_time': round(avg_response_time, 1),
            'response_change': round(response_change, 1),
            'high_risk_areas': high_risk_areas,
            'safety_score': round(safety_score, 1)
        }
