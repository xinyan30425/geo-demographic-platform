import json

def remove_leading_zeros_from_countyfp(input_geojson_path, output_geojson_path):
    with open(input_geojson_path, 'r') as infile:
        geojson_data = json.load(infile)
    
    for feature in geojson_data['features']:
        feature['properties']['COUNTYFP'] = feature['properties']['COUNTYFP'].lstrip('0')
    
    with open(output_geojson_path, 'w') as outfile:
        json.dump(geojson_data, outfile, indent=2)

# Modify the path as needed
input_geojson_path = 'county_maine.geojson'
output_geojson_path = 'modified_county_maine.geojson'

remove_leading_zeros_from_countyfp(input_geojson_path, output_geojson_path)
