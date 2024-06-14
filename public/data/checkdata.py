import pandas as pd
import json

# Load the CSV file
csv_path = 'district_maine_alzheimers_direct_estimates.csv'
csv_data = pd.read_csv(csv_path)

# Load the GeoJSON file
geojson_path = 'Maine_district.geojson'
with open(geojson_path, 'r') as f:
    geojson_data = json.load(f)

# Extract the GEOID from the CSV
csv_geoids = csv_data['GEOID'].unique()

# Extract the District values from the GeoJSON
geojson_districts = [feature['properties']['District'] for feature in geojson_data['features']]

# Display the unique GEOID values from the CSV and the District values from the GeoJSON
print("CSV GEOID values:", csv_geoids)
print("GeoJSON District values:", geojson_districts)
