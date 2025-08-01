"""
🏗️ DATABASE SETUP - Building Our Crime Data Foundation
======================================================

This script is like the "construction crew" for our dashboard. It builds
the foundation that everything else depends on - our crime database.

What this script does:
1. Creates a SQLite database file on your computer
2. Sets up tables to store crime incidents and neighborhood information
3. Generates 5,000+ realistic crime records spanning 24 months
4. Includes seasonal patterns (more crime in summer, less in winter)
5. Creates neighborhood-specific characteristics (Downtown has different patterns than suburbs)

Think of this as creating a realistic "practice dataset" that mimics what
real Toronto crime data might look like. This lets us build and test our
dashboard without needing access to actual police databases.

WHY WE NEED THIS:
- Real crime databases are restricted and not publicly accessible
- We need realistic data to test our dashboard features
- Sample data lets us demonstrate seasonal patterns and trends
- It provides a safe environment to learn and experiment

Author: [Your Name]
Purpose: Create a realistic crime database for dashboard development and learning
"""

import sqlite3  # For creating and managing our SQLite database
import pandas as pd  # For data manipulation (though we don't use it much here)
import numpy as np  # For statistical functions and random number generation
from datetime import datetime, timedelta  # For working with dates
import random  # For generating random data that feels realistic

def create_database():
    """
    This is our main function that builds the entire crime database from scratch.
    
    It's like being the architect, construction manager, and data entry clerk
    all rolled into one. We'll:
    1. Design the database structure (tables and columns)
    2. Build the tables
    3. Fill them with realistic sample data
    
    When this function finishes, we'll have a complete crime database ready
    for our dashboard to use!
    """
    
    print("🏗️ Starting database creation...")
    print("This might take a minute - we're generating 5,000+ realistic crime records!")
    
    # Connect to our database file (this creates the file if it doesn't exist)
    conn = sqlite3.connect('toronto_crime.db')
    cursor = conn.cursor()  # This is like our "pen" for writing to the database
    
    # =============================================================================
    # 📋 TABLE CREATION - Designing Our Database Structure
    # =============================================================================
    
    print("📋 Creating database tables...")
    
    # TABLE 1: Crime Incidents
    # This is our main table - each row represents one crime that happened
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS crime_incidents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique ID for each incident
        incident_date DATE,                     -- When did it happen?
        neighborhood TEXT,                      -- Where did it happen?
        crime_type TEXT,                        -- What type of crime was it?
        response_time_minutes REAL,             -- How long did police/EMS take to arrive?
        severity TEXT,                          -- How serious was it? (Low/Medium/High)
        latitude REAL,                          -- GPS coordinates (north-south)
        longitude REAL                          -- GPS coordinates (east-west)
    )
    ''')
    
    # TABLE 2: Neighborhoods
    # This table stores information about each Toronto district
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS neighborhoods (
        id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique ID for each neighborhood
        name TEXT UNIQUE,                       -- Neighborhood name (like "Downtown Core")
        district_code TEXT,                     -- Short code (like "DC")
        population INTEGER,                     -- How many people live there
        area_km2 REAL                          -- Size in square kilometers
    )
    ''')
    
    # Clear any existing data (in case we're running this script again)
    cursor.execute('DELETE FROM crime_incidents')
    cursor.execute('DELETE FROM neighborhoods')
    
    # =============================================================================
    # 🏘️ NEIGHBORHOOD DATA - Information About Toronto Districts
    # =============================================================================
    
    print("🏘️ Adding Toronto neighborhood data...")
    
    # Real Toronto neighborhoods with approximate population and area data
    # This gives our dashboard realistic context for analysis
    neighborhoods = [
        ('Downtown Core', 'DC', 85000, 15.2),    # Dense urban core
        ('Scarborough', 'SC', 632000, 187.7),   # Large suburban area
        ('North York', 'NY', 672000, 176.4),    # Mix of urban and suburban
        ('Etobicoke', 'ET', 365000, 123.9),     # Western suburbs
        ('East York', 'EY', 118000, 21.6),      # Smaller central area
        ('York', 'YK', 154000, 23.2),           # Central-west area
        ('Old Toronto', 'OT', 365000, 97.2)     # Historic core area
    ]
    
    # Insert all neighborhood data into our database
    cursor.executemany('''
    INSERT INTO neighborhoods (name, district_code, population, area_km2)
    VALUES (?, ?, ?, ?)
    ''', neighborhoods)
    
    # =============================================================================
    # 🚨 CRIME DATA GENERATION - Creating Realistic Incident Records
    # =============================================================================
    
    print("🚨 Generating realistic crime incident data...")
    
    # Define the types of crimes we'll include in our database
    # These are based on common crime categories in Toronto
    crime_types = [
        'Auto Theft',      # Car theft - a major concern in Toronto
        'Drug Offenses',   # Drug-related crimes - another priority
        'Assault',         # Physical attacks
        'Break & Enter',   # Home/business break-ins
        'Robbery',         # Theft with force or threat
        'Fraud',           # Financial crimes
        'Vandalism'        # Property damage
    ]
    
    # Severity levels for incidents
    severities = ['Low', 'Medium', 'High']
    
    # Generate data for the last 24 months (2 years of history)
    start_date = datetime.now() - timedelta(days=730)
    incidents = []  # This list will hold all our generated crime records
    
    print("📊 Generating incident records (this may take a moment)...")
    
    # Generate 5,000 realistic crime incidents
    for i in range(5000):
        # Pick a random date within our 24-month window
        incident_date = start_date + timedelta(days=random.randint(0, 730))
        
        # Pick a random neighborhood and crime type
        neighborhood = random.choice([n[0] for n in neighborhoods])
        crime_type = random.choice(crime_types)
        
        # =============================================================================
        # 🌡️ SEASONAL PATTERNS - Making Our Data Realistic
        # =============================================================================
        
        # Real crime data shows seasonal patterns, so let's simulate that
        month = incident_date.month
        if month in [6, 7, 8]:  # Summer months (June, July, August)
            crime_multiplier = 1.3  # 30% more crime in summer
        elif month in [12, 1, 2]:  # Winter months (December, January, February)
            crime_multiplier = 0.7  # 30% less crime in winter
        else:  # Spring and fall
            crime_multiplier = 1.0  # Normal levels
        
        # =============================================================================
        # 🏘️ NEIGHBORHOOD-SPECIFIC PATTERNS - Different Areas, Different Characteristics
        # =============================================================================
        
        # Different neighborhoods have different crime patterns and response times
        if neighborhood == 'Downtown Core':
            # Downtown: Higher crime, slower response due to traffic and density
            response_time = random.normalvariate(9.2, 2.1)  # Average 9.2 minutes, some variation
            severity_weights = [0.2, 0.3, 0.5]  # More high-severity incidents (50% high, 30% medium, 20% low)
        elif neighborhood == 'Scarborough':
            # Scarborough: Moderate crime, moderate response times
            response_time = random.normalvariate(7.8, 1.8)  # Average 7.8 minutes
            severity_weights = [0.3, 0.5, 0.2]  # Mostly medium severity
        else:
            # Other neighborhoods: Lower crime, faster response
            response_time = random.normalvariate(7.0, 1.5)  # Average 7.0 minutes
            severity_weights = [0.5, 0.3, 0.2]  # Mostly low severity
        
        # Make sure response time is realistic (minimum 3 minutes - it takes time to get anywhere!)
        response_time = max(3.0, response_time)
        
        # Choose severity based on neighborhood characteristics
        severity = np.random.choice(severities, p=severity_weights)
        
        # =============================================================================
        # 📍 GEOGRAPHIC COORDINATES - Placing Incidents on the Map
        # =============================================================================
        
        # Generate realistic GPS coordinates for Toronto
        # Toronto is roughly centered at 43.6532° N, 79.3832° W
        # We'll add some random variation to spread incidents around the city
        lat = 43.6532 + random.uniform(-0.3, 0.3)  # Latitude (north-south)
        lng = -79.3832 + random.uniform(-0.5, 0.5)  # Longitude (east-west)
        
        # Create a record for this incident
        incidents.append((
            incident_date.strftime('%Y-%m-%d'),  # Format date as YYYY-MM-DD
            neighborhood,
            crime_type,
            round(response_time, 1),  # Round to 1 decimal place
            severity,
            round(lat, 6),  # GPS coordinates to 6 decimal places (about 10cm accuracy)
            round(lng, 6)
        ))
        
        # Show progress every 1000 incidents so user knows we're working
        if (i + 1) % 1000 == 0:
            print(f"   ✅ Generated {i + 1} incidents...")
    
    # =============================================================================
    # 💾 SAVING DATA TO DATABASE - Writing All Our Records
    # =============================================================================
    
    print("💾 Saving all incident records to database...")
    
    # Insert all our generated incidents into the database
    # This is like filing thousands of crime reports in our digital filing cabinet
    cursor.executemany('''
    INSERT INTO crime_incidents 
    (incident_date, neighborhood, crime_type, response_time_minutes, severity, latitude, longitude)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', incidents)
    
    # Save all changes to the database file
    conn.commit()
    conn.close()
    
    # =============================================================================
    # 🎉 SUCCESS! - Database Creation Complete
    # =============================================================================
    
    print("\n🎉 Database created successfully!")
    print(f"📊 Total incidents generated: {len(incidents):,}")
    print("📁 Database saved as: toronto_crime.db")
    print("\n✅ Your dashboard is now ready to use!")
    print("   Run 'streamlit run app.py' to start the dashboard")

# =============================================================================
# 🚀 SCRIPT EXECUTION - Run This When File Is Called Directly
# =============================================================================

if __name__ == "__main__":
    """
    This special block only runs when someone executes this file directly
    (like running 'python setup_database.py' from the command line).
    
    It won't run if this file is imported by another Python script.
    This is a common Python pattern for scripts that can be both
    imported as modules and run as standalone programs.
    """
    create_database()
