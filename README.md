# tilecount

Counts web map tiles within a Polygon(s)

## Usage

    yarn install
    ./index.js min_zoom max_zoom [feature.geojson]

If you omit the file then it will be read from stdin. The GeoJSON can be either a FeatureCollection or single Feature.
