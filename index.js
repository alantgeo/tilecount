#!/usr/bin/env node

var SM = require('@mapbox/sphericalmercator')
var turf = {
    bbox: require('@turf/bbox').default,
    booleanIntersects: require('@turf/boolean-intersects').default,
    bboxPolygon: require('@turf/bbox-polygon').default
};
var sm = new SM({ size: 256 });
var fs = require('fs');
var args = process.argv.slice(2)

if (args.length < 2) {
    console.error("Usage: ./index.js min_zoom max_zoom [feature.geojson]");
    process.exit();
}

var minZoom = args[0];
var maxZoom = args[1];
var source = JSON.parse(fs.readFileSync(args.length > 2 ? args[2] : '/dev/stdin'));

var tiles = {};
if (source.features) {
    source.features.forEach(function (feature) {
        tileCount(feature, minZoom, maxZoom)
    });
} else {
    tileCount(source, minZoom, maxZoom)
}

function tileCount(feature, minZoom, maxZoom) {
    const bbox = turf.bbox(feature);
    for (var z = minZoom; z <= Math.min(16, maxZoom); z++) {
        var xyz = sm.xyz(bbox, z);
        for (var x = xyz.minX; x <= xyz.maxX; x++) {
            for (var y = xyz.minY; y <= xyz.maxY; y++) {
                if (turf.booleanIntersects(turf.bboxPolygon(sm.bbox(x, y, z)), feature)) {
                    tiles[[z, x, y].join('/')] = true;
                }
            }
        }
    }
};

console.log(Number(Object.keys(tiles).length).toLocaleString() + ' tiles from zoom ' + minZoom + '-' + maxZoom);
