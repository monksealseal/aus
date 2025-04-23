// Function to load flood warnings and display them on the map
function loadFloodWarnings() {
    console.log("Loading flood warnings...");
    
    // Create the UI panel for flood warnings
    createFloodWarningsPanel();
    
    // Create flood warning layers (but don't add to map yet)
    const floodWarningLayer = L.layerGroup();
    const floodPolygonLayer = L.layerGroup();
    
    // Use hardcoded data instead of fetching from files
    // This avoids CORS and file path issues
    const floodWarningsData = [
        {
            "name": "Riverine Flood",
            "received_at": "Mar 30, 2025 00:08:47.000 GMT+0000",
            "processed_at": "Mar 30, 2025 00:08:49.000 GMT+0000",
            "polygons_count": 19,
            "severity": "Severe",
            "certainty": "Unknown",
            "start": "Mar 29, 2025 23:53:30.000 GMT+0000",
            "end": "Apr 02, 2025 02:53:30.000 GMT+0000",
            "category": "flood",
            "country": "Australia",
            "state": "Queensland",
            "urgency": "Unknown",
            "sender": "Australian Governm Bureau of Meteorology",
            "headline": "Major Flood Warning for Bulloo River to Quilpie and Bulloo River at Quilpie",
            "description": "Major flooding is occurring along the Bulloo River to Quilpie.\nThe Bulloo River at Quilpie is currently at 6.43 metres and falling, above the major flood level (5.00 m). The Bulloo River at Quilpie is likely to remain above the major flood level (5.00 m) for the next few days.",
            "instruction": "Remember: If it's flooded, forget it. For flood emergency assistance contact the SES on 132 500. For life threatening emergencies, call Triple Zero (000) immediately.\nCurrent emergency information is available at www.qld.gov.au/alerts"
        },
        {
            "name": "Riverine Flood",
            "received_at": "Mar 30, 2025 05:38:56.000 GMT+0000",
            "processed_at": "Mar 30, 2025 05:38:56.000 GMT+0000",
            "polygons_count": 19,
            "severity": "Severe",
            "certainty": "Unknown",
            "start": "Mar 30, 2025 05:31:32.000 GMT+0000",
            "end": "Apr 02, 2025 08:31:32.000 GMT+0000",
            "category": "flood",
            "country": "Australia",
            "state": "Queensland",
            "urgency": "Unknown",
            "sender": "Australian Government Bureau of Meteorology",
            "headline": "Major Flood Warning for Bulloo River to Quilpie and Bulloo River at Quilpie",
            "description": "Major flooding is occurring along the Bulloo River to Quilpie.\nThe Bulloo River at Quilpie is currently at 6.36 metres and falling, above the major flood level (5.00 m). The Bulloo River at Quilpie is likely to remain above the major flood level (5.00 m) for the next few days.",
            "instruction": "Remember: If it's flooded, forget it. For flood emergency assistance contact the SES on 132 500. For life threatening emergencies, call Triple Zero (000) immediately.\nCurrent emergency information is available at www.qld.gov.au/alerts"
        },
        {
            "name": "Riverine Flood",
            "received_at": "Mar 30, 2025 22:19:04.000 GMT+0000",
            "processed_at": "Mar 30, 2025 22:19:05.000 GMT+0000",
            "polygons_count": 19,
            "severity": "Severe",
            "certainty": "Unknown",
            "start": "Mar 30, 2025 22:05:24.000 GMT+0000",
            "end": "Apr 03, 2025 01:05:24.000 GMT+0000",
            "category": "flood",
            "country": "Australia",
            "state": "Queensland",
            "urgency": "Unknown",
            "sender": "Australian Government Bureau of Meteorology",
            "headline": "Major Flood Warning for Bulloo River to Quilpie and Bulloo River at Quilpie",
            "description": "Major flooding is occurring along the Bulloo River to Quilpie.\nThe Bulloo River at Quilpie is currently at 6.21 metres and steady, above the major flood level (5.00 m). The Bulloo River at Quilpie is likely to remain above the major flood level (5.00 m) for the next few days.",
            "instruction": "Remember: If it's flooded, forget it. For flood emergency assistance contact the SES on 132 500. For life threatening emergencies, call Triple Zero (000) immediately.\nCurrent emergency information is available at www.qld.gov.au/alerts"
        },
        {
            "name": "Riverine Flood",
            "received_at": "Mar 31, 2025 05:49:12.000 GMT+0000",
            "processed_at": "Mar 31, 2025 05:49:16.000 GMT+0000",
            "polygons_count": 19,
            "severity": "Severe",
            "certainty": "Unknown",
            "start": "Mar 31, 2025 05:38:31.000 GMT+0000",
            "end": "Apr 03, 2025 08:38:31.000 GMT+0000",
            "category": "flood",
            "country": "Australia",
            "state": "New South Wales",
            "urgency": "Unknown",
            "sender": "Australian Government Bureau of Meteorology",
            "headline": "Major Flood Warning for Bulloo River downstream of Quilpie and Bulloo River at Thargomindah",
            "description": "Major flooding is occurring along the Bulloo River downstream of Quilpie, including at Autumnvale.\nThe Bulloo River at Thargomindah is currently at 6.95 metres and rising, above the major flood level (5.50 m). The Bulloo River at Thargomindah is currently above the 1974 level of 6.78 metres. The river level at Thargomindah may reach around 7.20 metres overnight Monday into Tuesday. Further rises are possible as floodwaters continue to move downstream.",
            "instruction": "Remember: If it's flooded, forget it. For flood emergency assistance contact the SES on 132 500. For life threatening emergencies, call Triple Zero (000) immediately.\nCurrent emergency information is available at www.qld.gov.au/alerts"
        },
        {
            "name": "Riverine Flood",
            "received_at": "Apr 01, 2025 00:09:20.000 GMT+0000",
            "processed_at": "Apr 01, 2025 00:09:20.000 GMT+0000",
            "polygons_count": 19,
            "severity": "Severe",
            "certainty": "Unknown",
            "start": "Mar 31, 2025 23:56:48.000 GMT+0000",
            "end": "Apr 04, 2025 02:56:48.000 GMT+0000",
            "category": "flood",
            "country": "Australia",
            "state": "Queensland",
            "urgency": "Unknown",
            "sender": "Australian Government Bureau of Meteorology",
            "headline": "Major Flood Warning for Bulloo River to Quilpie and Bulloo River at Quilpie",
            "description": "Major flooding is occurring along the Bulloo River to Quilpie.\nThe Bulloo River at Quilpie is currently at 5.84 metres and falling, above the major flood level (5.00 m). The Bulloo River at Quilpie is likely to remain above the major flood level (5.00 m) for the next few days. Renewed rises are possible from mid-week with forecast rainfall.",
            "instruction": "Remember: If it's flooded, forget it. For flood emergency assistance contact the SES on 132 500. For life threatening emergencies, call Triple Zero (000) immediately.\nCurrent emergency information is available at www.qld.gov.au/alerts"
        }
    ];
    
    // Create polygons data
    const polygonsData = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "id": 1,
                    "name": "Bulloo River at Quilpie",
                    "warningId": 1,
                    "severity": "Severe",
                    "category": "flood",
                    "headline": "Major Flood Warning for Bulloo River to Quilpie and Bulloo River at Quilpie",
                    "description": "Major flooding is occurring along the Bulloo River to Quilpie.\nThe Bulloo River at Quilpie is currently at 6.43 metres and falling, above the major flood level (5.00 m). The Bulloo River at Quilpie is likely to remain above the major flood level (5.00 m) for the next few days."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [144.43, -26.62],
                            [144.35, -26.65],
                            [144.25, -26.60],
                            [144.15, -26.65],
                            [144.25, -26.75],
                            [144.45, -26.75],
                            [144.50, -26.70],
                            [144.43, -26.62]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 2,
                    "name": "Bulloo River at Thargomindah",
                    "warningId": 4,
                    "severity": "Severe",
                    "category": "flood",
                    "headline": "Major Flood Warning for Bulloo River downstream of Quilpie and Bulloo River at Thargomindah",
                    "description": "Major flooding is occurring along the Bulloo River downstream of Quilpie, including at Autumnvale.\nThe Bulloo River at Thargomindah is currently at 6.95 metres and rising, above the major flood level (5.50 m). The Bulloo River at Thargomindah is currently above the 1974 level of 6.78 metres. The river level at Thargomindah may reach around 7.20 metres overnight Monday into Tuesday. Further rises are possible as floodwaters continue to move downstream."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [143.83, -27.95],
                            [143.75, -28.05],
                            [143.78, -28.15],
                            [143.88, -28.20],
                            [143.98, -28.15],
                            [144.00, -28.05],
                            [143.95, -27.95],
                            [143.83, -27.95]
                        ]
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "id": 3,
                    "name": "Thomson River at Longreach",
                    "warningId": 7,
                    "severity": "Severe",
                    "category": "flood",
                    "headline": "Major Flood Warning for Thomson River",
                    "description": "Minor to major flooding is occurring along the Thomson River.\nThe Thomson River at Longreach is currently at 3.72 metres and rising, above the minor flood level (3.30 m). The Thomson River at Longreach is expected to reach the moderate flood level (4.30 m) early Monday evening. The river level is likely to reach the major flood level (5.30 m) late Tuesday morning. Further river level rises are possible as upstream floodwaters arrive."
                },
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [144.23, -23.40],
                            [144.20, -23.45],
                            [144.25, -23.50],
                            [144.35, -23.50],
                            [144.40, -23.45],
                            [144.35, -23.40],
                            [144.23, -23.40]
                        ]
                    ]
                }
            }
        ]
    };
    
    // Process flood warning data
    console.log("Processing flood warnings data");
    processFloodWarnings(floodWarningsData, floodWarningLayer);
    
    // Store the layer for later use
    window.floodWarningLayer = floodWarningLayer;
    
    // Process polygon data
    console.log("Processing flood polygon data");
    processPolygonData(polygonsData, floodPolygonLayer);
    
    // Store the layer for later use
    window.floodPolygonLayer = floodPolygonLayer;
    
    // Set initial visibility based on toggle state
    updateFloodLayerVisibility();
}

// Process flood warnings data
function processFloodWarnings(data, floodWarningLayer) {
    data.forEach((warning, index) => {
        // Get coordinates based on state
        let centerLat, centerLng;
        
        if (warning.state === 'Queensland') {
            centerLat = -23.5 + (Math.random() * 2 - 1); // Add some randomness
            centerLng = 144.0 + (Math.random() * 2 - 1);
        } else if (warning.state === 'New South Wales') {
            centerLat = -32.0 + (Math.random() * 2 - 1);
            centerLng = 147.0 + (Math.random() * 2 - 1);
        } else {
            // Default to central Australia
            centerLat = -25.0 + (Math.random() * 2 - 1);
            centerLng = 134.0 + (Math.random() * 2 - 1);
        }
        
        // Create marker
        const marker = L.circleMarker([centerLat, centerLng], {
            radius: 8,
            fillColor: '#ffc107',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
        
        // Add popup content
        const popupContent = `
            <div style="max-width: 300px;">
                <h5>${warning.headline}</h5>
                <p><strong>Location:</strong> ${warning.state}</p>
                <p><strong>Severity:</strong> ${warning.severity}</p>
                <p><strong>Start:</strong> ${warning.start}</p>
                <p><strong>End:</strong> ${warning.end}</p>
                <p>${warning.description}</p>
                <p class="text-danger"><strong>Instruction:</strong> ${warning.instruction}</p>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Add to layer group
        floodWarningLayer.addLayer(marker);
        
        // Add to UI list
        addFloodWarningToList(warning, index, marker);
    });
}

// Process polygon data
function processPolygonData(data, floodPolygonLayer) {
    const geoJsonLayer = L.geoJSON(data, {
        style: function(feature) {
            return {
                fillColor: '#dc3545',
                weight: 2,
                opacity: 1,
                color: '#9c2a33',
                fillOpacity: 0.6
            };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties) {
                // Create popup content
                const popupContent = `
                    <div style="max-width: 300px;">
                        <h5>${feature.properties.headline}</h5>
                        <p><strong>Location:</strong> ${feature.properties.name}</p>
                        <p><strong>Severity:</strong> ${feature.properties.severity}</p>
                        <p>${feature.properties.description}</p>
                    </div>
                `;
                
                layer.bindPopup(popupContent);
            }
        }
    });
    
    floodPolygonLayer.addLayer(geoJsonLayer);
}

// Create the flood warnings panel
function createFloodWarningsPanel() {
    // Check if panel already exists
    if (document.getElementById('flood-warnings-panel')) return;
    
    // Create the panel
    const panel = document.createElement('div');
    panel.id = 'flood-warnings-panel';
    panel.className = 'flood-warnings-panel';
    
    // Position the panel below the filter panel
    panel.style.cssText = `
        position: absolute;
        top: 340px;
        left: 10px;
        z-index: 1000;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        width: 340px;
        max-height: 400px;
        display: flex;
        flex-direction: column;
    `;
    
    // Create header
    const header = document.createElement('div');
    header.className = 'flood-header';
    header.style.cssText = `
        padding: 15px;
        background-color: #dc3545;
        color: white;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
    header.innerHTML = `
        <h5 style="margin: 0;">Active Flood Warnings</h5>
        <div>
            <div class="form-check form-switch" style="display: inline-block; margin-right: 10px;">
                <input class="form-check-input" type="checkbox" id="flood-warnings-toggle" checked>
                <label class="form-check-label" for="flood-warnings-toggle" style="color: white;">Show</label>
            </div>
            <button id="flood-warnings-close" class="btn btn-sm btn-light">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Create content
    const content = document.createElement('div');
    content.className = 'flood-content';
    content.style.cssText = `
        padding: 15px;
        overflow-y: auto;
        flex-grow: 1;
        max-height: 300px;
    `;
    content.innerHTML = `
        <div id="flood-warnings-list">
            <div class="text-center py-3">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Loading flood warnings...</p>
            </div>
        </div>
    `;
    
    // Assemble panel
    panel.appendChild(header);
    panel.appendChild(content);
    
    // Add to document
    document.body.appendChild(panel);
    
    // Set up event listeners
    document.getElementById('flood-warnings-toggle').addEventListener('change', updateFloodLayerVisibility);
    
    document.getElementById('flood-warnings-close').addEventListener('click', function() {
        panel.style.display = 'none';
    });
    
    // Add a button to the filter panel to show/hide flood warnings
    setTimeout(addFloodWarningsButton, 1000); // Delay to ensure filter panel is loaded
}

// Add a button to the filter panel to show/hide flood warnings
function addFloodWarningsButton() {
    // Check if the button already exists
    if (document.getElementById('toggle-flood-warnings-btn')) return;
    
    // Check if filter panel exists
    const filterPanel = document.getElementById('filter-panel');
    if (!filterPanel) {
        console.log("Filter panel not found, trying again in 1 second");
        setTimeout(addFloodWarningsButton, 1000);
        return;
    }
    
    // Create button
    const button = document.createElement('button');
    button.id = 'toggle-flood-warnings-btn';
    button.className = 'btn btn-danger mt-3 w-100';
    button.innerHTML = '<i class="fas fa-water"></i> Show/Hide Flood Warnings';
    
    // Add to filter panel
    const filterContent = filterPanel.querySelector('.filter-content');
    if (filterContent) {
        // Create a divider
        const divider = document.createElement('hr');
        divider.className = 'my-3';
        
        // Add divider and button
        filterContent.appendChild(divider);
        filterContent.appendChild(button);
        
        // Add event listener
        button.addEventListener('click', function() {
            const panel = document.getElementById('flood-warnings-panel');
            if (panel) {
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            }
        });
        
        console.log("Flood warnings button added to filter panel");
    } else {
        console.log("Filter content not found in filter panel");
    }
}

// Add a flood warning to the list
function addFloodWarningToList(warning, index, marker) {
    const list = document.getElementById('flood-warnings-list');
    if (!list) return;
    
    // Clear loading message if this is the first item
    if (index === 0) {
        list.innerHTML = '';
    }
    
    // Create list item
    const item = document.createElement('div');
    item.className = 'flood-item';
    item.style.cssText = `
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    `;
    item.dataset.index = index;
    
    // Format date
    let dateStr = 'Unknown';
    try {
        const date = new Date(warning.start);
        dateStr = date.toLocaleDateString('en-AU', {
            day: 'numeric',
            month: 'short'
        });
    } catch (e) {}
    
    // Create content
    item.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 5px;">${warning.headline.split(' for ')[0]}</div>
        <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;">
            <span>${warning.state}</span>
            <span>${dateStr}</span>
        </div>
        <div style="margin-top: 5px;">
            <span style="display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 11px; font-weight: 600; background-color: #dc3545; color: white;">
                ${warning.severity}
            </span>
        </div>
    `;
    
    // Add click event to focus on warning
    item.addEventListener('click', function() {
        if (marker) {
            map.setView(marker.getLatLng(), 8);
            marker.openPopup();
        }
    });
    
    // Add to list
    list.appendChild(item);
}

// Update flood layer visibility based on toggle state
function updateFloodLayerVisibility() {
    const toggle = document.getElementById('flood-warnings-toggle');
    if (!toggle) return;
    
    if (toggle.checked) {
        if (window.floodWarningLayer) map.addLayer(window.floodWarningLayer);
        if (window.floodPolygonLayer) map.addLayer(window.floodPolygonLayer);
    } else {
        if (window.floodWarningLayer) map.removeLayer(window.floodWarningLayer);
        if (window.floodPolygonLayer) map.removeLayer(window.floodPolygonLayer);
    }
}