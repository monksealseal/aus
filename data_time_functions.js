// File Processing Functions with Visualization Options

// Show a toast notification
function showToast(message) {
    // Check if toast container exists, create it if not
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1500;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.style.cssText = `
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 15px;
        border-radius: 4px;
        margin-bottom: 10px;
        min-width: 200px;
    `;
    toast.innerHTML = `<i class="fas fa-info-circle me-2"></i> ${message}`;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}

// Global variables
window.visualizationOptions = {
    rainfall: {
        visType: 'heatmap',
        color: 'blue',
        visible: true
    },
    events: {
        filter: 'all',
        size: 'yes',
        visible: true,
        timeSlider: true
    },
    floodWarnings: {
        visType: 'circles',
        color: 'yes',
        visible: true
    },
    floodPolygons: {
        opacity: 0.6,
        weight: 2,
        visible: true
    }
};

// Process file uploads with visualization options
function processFilesWithOptions() {
    // Get file inputs
    const rainfallFile = document.getElementById('rainfall-data')?.files[0];
    const historicalFile = document.getElementById('historical-data')?.files[0];
    const floodWarningsFile = document.getElementById('flood-warnings')?.files[0];
    const floodPolygonsFile = document.getElementById('flood-polygons')?.files[0];
    
    // Get visualization options
    updateVisualizationOptions();
    
    // Show loading spinner
    const processBtn = document.getElementById('process-files');
    const originalText = processBtn.innerHTML;
    processBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...';
    processBtn.disabled = true;
    
    let filesProcessed = 0;
    let totalFiles = 0;
    
    // Process rainfall data
    if (rainfallFile) {
        totalFiles++;
        processRainfallData(rainfallFile, () => {
            filesProcessed++;
            checkComplete();
        });
    }
    
    // Process historical data
    if (historicalFile) {
        totalFiles++;
        processHistoricalData(historicalFile, () => {
            filesProcessed++;
            checkComplete();
        });
    }
    
    // Process flood warnings
    if (floodWarningsFile) {
        totalFiles++;
        processFloodWarnings(floodWarningsFile, () => {
            filesProcessed++;
            checkComplete();
        });
    }
    
    // Process flood polygons
    if (floodPolygonsFile) {
        totalFiles++;
        processFloodPolygons(floodPolygonsFile, () => {
            filesProcessed++;
            checkComplete();
        });
    }
    
    function checkComplete() {
        if (filesProcessed === totalFiles && totalFiles > 0) {
            // Restore button
            setTimeout(() => {
                if (processBtn) {
                    processBtn.innerHTML = originalText;
                    processBtn.disabled = false;
                }
            }, 500);
            
            showToast(`Successfully processed ${totalFiles} file(s)`);
            
            // Update map visualizations
            updateMapVisualizations();
            
            // Reset time slider to beginning
            if (window.historicalData && window.historicalData.length > 0) {
                const timeSlider = document.getElementById('time-slider');
                if (timeSlider) {
                    timeSlider.value = 0;
                    updateTimeSliderDisplay();
                }
            }
        }
    }
}

// Update visualization options from UI
function updateVisualizationOptions() {
    // Rainfall options
    window.visualizationOptions.rainfall.visType = document.getElementById('rainfall-vis-type')?.value || 'heatmap';
    window.visualizationOptions.rainfall.color = document.getElementById('rainfall-color')?.value || 'blue';
    window.visualizationOptions.rainfall.visible = document.getElementById('rainfall-visibility')?.checked ?? true;
    
    // Events options
    window.visualizationOptions.events.filter = document.getElementById('events-filter')?.value || 'all';
    window.visualizationOptions.events.size = document.getElementById('events-size')?.value || 'yes';
    window.visualizationOptions.events.visible = document.getElementById('events-visibility')?.checked ?? true;
    window.visualizationOptions.events.timeSlider = document.getElementById('time-slider-events')?.checked ?? true;
    
    // Flood warnings options
    window.visualizationOptions.floodWarnings.visType = document.getElementById('flood-warnings-vis-type')?.value || 'circles';
    window.visualizationOptions.floodWarnings.color = document.getElementById('flood-warnings-color')?.value || 'yes';
    window.visualizationOptions.floodWarnings.visible = document.getElementById('flood-warnings-visibility')?.checked ?? true;
    
    // Flood polygons options
    window.visualizationOptions.floodPolygons.opacity = parseFloat(document.getElementById('flood-polygons-opacity')?.value || 0.6);
    window.visualizationOptions.floodPolygons.weight = parseInt(document.getElementById('flood-polygons-weight')?.value || 2);
    window.visualizationOptions.floodPolygons.visible = document.getElementById('flood-polygons-visibility')?.checked ?? true;
}

// Process rainfall data file
function processRainfallData(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Parse CSV data
            Papa.parse(e.target.result, {
                header: true,
                complete: function(results) {
                    // Store rainfall data
                    window.rainfallData = results.data;
                    
                    // Call callback
                    if (typeof callback === 'function') callback();
                }
            });
        } catch (err) {
            console.error('Error parsing rainfall data:', err);
            showToast('Error parsing rainfall data');
            if (typeof callback === 'function') callback();
        }
    };
    reader.readAsText(file);
}

// Process historical data file
function processHistoricalData(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Parse CSV data
            Papa.parse(e.target.result, {
                header: true,
                complete: function(results) {
                    // Store historical data and sort by date
                    window.historicalData = results.data;
                    
                    // Try to sort by date if possible
                    try {
                        window.historicalData.sort((a, b) => {
                            const dateA = new Date(a.Date || a['Date/Time'] || a.date || 0);
                            const dateB = new Date(b.Date || b['Date/Time'] || b.date || 0);
                            return dateA - dateB;
                        });
                    } catch (e) {
                        console.warn('Could not sort historical data by date:', e);
                    }
                    
                    // Find min/max dates for time slider
                    if (window.historicalData.length > 0) {
                        const firstDate = new Date(window.historicalData[0].Date || window.historicalData[0]['Date/Time'] || window.historicalData[0].date || '1980-01-01');
                        const lastDate = new Date(window.historicalData[window.historicalData.length - 1].Date || 
                                                  window.historicalData[window.historicalData.length - 1]['Date/Time'] || 
                                                  window.historicalData[window.historicalData.length - 1].date || '2025-04-01');
                        
                        window.timeRange = {
                            start: firstDate,
                            end: lastDate
                        };
                    }
                    
                    // Call callback
                    if (typeof callback === 'function') callback();
                }
            });
        } catch (err) {
            console.error('Error parsing historical data:', err);
            showToast('Error parsing historical data');
            if (typeof callback === 'function') callback();
        }
    };
    reader.readAsText(file);
}

// Process flood warnings file
function processFloodWarnings(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Parse JSON data
            const data = JSON.parse(e.target.result);
            // Store flood warnings data
            window.floodWarningsData = data;
            
            // Call callback
            if (typeof callback === 'function') callback();
        } catch (err) {
            console.error('Error parsing flood warnings data:', err);
            showToast('Error parsing flood warnings data');
            if (typeof callback === 'function') callback();
        }
    };
    reader.readAsText(file);
}

// Process flood polygons file
function processFloodPolygons(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            // Parse JSON data
            const data = JSON.parse(e.target.result);
            // Store flood polygons data
            window.floodPolygonsData = data;
            
            // Call callback
            if (typeof callback === 'function') callback();
        } catch (err) {
            console.error('Error parsing flood polygons data:', err);
            showToast('Error parsing flood polygons data');
            if (typeof callback === 'function') callback();
        }
    };
    reader.readAsText(file);
}

// Update map visualizations based on current options
function updateMapVisualizations() {
    // Update rainfall visualization
    updateRainfallVisualization();
    
    // Update historical events visualization
    updateEventsVisualization();
    
    // Update flood warnings visualization
    updateFloodWarningsVisualization();
    
    // Update flood polygons visualization
    updateFloodPolygonsVisualization();
}

// Update rainfall visualization
function updateRainfallVisualization() {
    if (!window.rainfallData || !window.map) {
        console.warn('Cannot update rainfall visualization: missing rainfall data or map');
        return;
    }
    
    console.log('Updating rainfall visualization with', window.rainfallData.length, 'data points');
    
    // Clear existing rainfall layers
    if (window.map.hasLayer(window.layers.dailyRainfall)) {
        window.map.removeLayer(window.layers.dailyRainfall);
    }
    if (window.map.hasLayer(window.layers.twelveMonthRainfall)) {
        window.map.removeLayer(window.layers.twelveMonthRainfall);
    }
    if (window.map.hasLayer(window.layers.thirtySixMonthRainfall)) {
        window.map.removeLayer(window.layers.thirtySixMonthRainfall);
    }
    if (window.map.hasLayer(window.heatmapLayer)) {
        window.map.removeLayer(window.heatmapLayer);
    }
    
    // Reset layers
    window.layers.twelveMonthRainfall = L.layerGroup();
    
    // If not visible, return
    if (!window.visualizationOptions.rainfall.visible) return;
    
    // Process rainfall data based on visualization type
    const visType = window.visualizationOptions.rainfall.visType;
    const colorOption = window.visualizationOptions.rainfall.color;
    
    // Get color based on option
    function getColor(intensity) {
        switch (colorOption) {
            case 'blue':
                return `rgba(51, 136, 255, ${Math.min(intensity/100, 0.9)})`;
            case 'red':
                return `rgba(255, 51, 51, ${Math.min(intensity/100, 0.9)})`;
            case 'green':
                return `rgba(51, 204, 51, ${Math.min(intensity/100, 0.9)})`;
            case 'purple':
                return `rgba(153, 51, 204, ${Math.min(intensity/100, 0.9)})`;
            default:
                return `rgba(51, 136, 255, ${Math.min(intensity/100, 0.9)})`;
        }
    }
    
    // Process rainfall data
    if (visType === 'heatmap') {
        // Create heatmap points array
        const heatPoints = [];
        
        window.rainfallData.forEach(station => {
            // Try to extract coordinates
            let lat = null, lng = null;
            
            // Try to find lat/long in various formats
            const latFields = ['Latitude (°)', 'Latitude (Â°)', 'Latitude', 'Latitude (deg)'];
            const lonFields = ['Longitude (°)', 'Longitude (Â°)', 'Longitude', 'Longitude (deg)'];
            
            for (const field of latFields) {
                if (station[field] !== undefined && station[field] !== null) {
                    lat = parseFloat(station[field]);
                    break;
                }
            }
            
            for (const field of lonFields) {
                if (station[field] !== undefined && station[field] !== null) {
                    lng = parseFloat(station[field]);
                    break;
                }
            }
            
            // If we have coordinates and rainfall data
            if (!isNaN(lat) && !isNaN(lng)) {
                // Get rainfall value
                let intensity = 0;
                if (station['12-month rainfall'] || station['12 month rainfall']) {
                    intensity = parseFloat(station['12-month rainfall'] || station['12 month rainfall'] || 0);
                }
                
                // Add to heatmap points with intensity
                if (!isNaN(intensity) && intensity > 0) {
                    heatPoints.push([lat, lng, Math.min(intensity / 10, 1)]); // Normalize intensity
                }
            }
        });
        
        // Define gradient colors based on color option
        let gradient;
        switch (colorOption) {
            case 'blue':
                gradient = {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'};
                break;
            case 'red':
                gradient = {0.4: 'yellow', 0.7: 'orange', 1.0: 'red'};
                break;
            case 'green':
                gradient = {0.4: 'lime', 0.7: 'green', 1.0: 'darkgreen'};
                break;
            case 'purple':
                gradient = {0.4: 'violet', 0.7: 'purple', 1.0: 'darkviolet'};
                break;
            case 'rainbow':
                gradient = {0.1: 'blue', 0.3: 'cyan', 0.5: 'lime', 0.7: 'yellow', 0.9: 'orange', 1.0: 'red'};
                break;
            default:
                gradient = {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'};
        }
        
        // Create heatmap layer if function exists
        if (typeof L.heatLayer === 'function') {
            window.heatmapLayer = L.heatLayer(heatPoints, {
                radius: 50,  // Increased from 25
                blur: 30,    // Increased from 15
                maxZoom: 10,
                gradient: gradient
            });
            
            // Add to map
            window.map.addLayer(window.heatmapLayer);
        } else {
            console.warn('L.heatLayer is not available');
            showToast('Heatmap plugin not available. Using markers instead.');
            
            // Fallback to markers
            window.visualizationOptions.rainfall.visType = 'markers';
            updateRainfallVisualization();
            return;
        }
    } else if (visType === 'markers' || visType === 'circles') {
        window.rainfallData.forEach(station => {
            // Try to extract coordinates
            let lat = null, lng = null;
            
            // Try to find lat/long in various formats
            const latFields = ['Latitude (°)', 'Latitude (Â°)', 'Latitude', 'Latitude (deg)'];
            const lonFields = ['Longitude (°)', 'Longitude (Â°)', 'Longitude', 'Longitude (deg)'];
            
            for (const field of latFields) {
                if (station[field] !== undefined && station[field] !== null) {
                    lat = parseFloat(station[field]);
                    break;
                }
            }
            
            for (const field of lonFields) {
                if (station[field] !== undefined && station[field] !== null) {
                    lng = parseFloat(station[field]);
                    break;
                }
            }
            
            // If we don't have proper coordinates, skip this station
            if (isNaN(lat) || isNaN(lng)) return;
            
            // Check if we have a rainfall value
            if (station['12-month rainfall'] || station['12 month rainfall']) {
                const rainfallValue = parseFloat(station['12-month rainfall'] || station['12 month rainfall'] || 0);
                
                if (!isNaN(rainfallValue)) {
                    let marker;
                    
                    // Create marker based on visualization type
                    if (visType === 'circles') {
                        // Create circle with size based on rainfall value
                        marker = L.circle([lat, lng], {
                            radius: Math.max(rainfallValue * 200, 5000),
                            color: getColor(rainfallValue),
                            fillColor: getColor(rainfallValue),
                            fillOpacity: 0.6,
                            weight: 1
                        });
                    } else {
                        // Create circle marker with size based on rainfall value
                        marker = L.circleMarker([lat, lng], {
                            radius: Math.min(rainfallValue / 10, 15),
                            color: '#000',
                            fillColor: getColor(rainfallValue).replace(/[^,]+(?=\))/, '0.7'),
                            fillOpacity: 0.7,
                            weight: 1
                        });
                    }
                    
                    // Create popup with station details
                    const popupContent = `
                        <div style="max-width: 300px;">
                            <h5>${station['Station name'] || 'Weather Station'}</h5>
                            <p><strong>12-Month Rainfall:</strong> ${rainfallValue.toFixed(1)} mm</p>
                            <p><strong>Latitude:</strong> ${lat.toFixed(4)}</p>
                            <p><strong>Longitude:</strong> ${lng.toFixed(4)}</p>
                        </div>
                    `;
                    
                    marker.bindPopup(popupContent);
                    
                    // Add to 12-month rainfall layer
                    window.layers.twelveMonthRainfall.addLayer(marker);
                }
            }
        });
        
        // Add layer to map
        window.map.addLayer(window.layers.twelveMonthRainfall);
    }
}

// Update historical events visualization
function updateEventsVisualization(timeValue) {
    if (!window.historicalData || !window.map) {
        console.warn('Cannot update events visualization: missing historical data or map');
        return;
    }
    
    console.log('Updating events visualization with', window.historicalData.length, 'events');
    
    // Clear existing events layer
    if (window.map.hasLayer(window.layers.events)) {
        window.map.removeLayer(window.layers.events);
    }
    
    // Reset events layer
    window.layers.events = L.layerGroup();
    
    // If not visible, return
    if (!window.visualizationOptions.events.visible) return;
    
    // Filter events by type if needed
    const eventFilter = window.visualizationOptions.events.filter;
    const sizeByEvent = window.visualizationOptions.events.size === 'yes';
    
    // Get any specific event type filters from the UI
    let eventTypeFilters = [];
    try {
        if (document.getElementById('type-flood') && !document.getElementById('type-flood').checked) {
            eventTypeFilters.push('flood');
        }
        if (document.getElementById('type-cyclone') && !document.getElementById('type-cyclone').checked) {
            eventTypeFilters.push('cyclone');
        }
        if (document.getElementById('type-fire') && !document.getElementById('type-fire').checked) {
            eventTypeFilters.push('fire');
        }
        if (document.getElementById('type-storm') && !document.getElementById('type-storm').checked) {
            eventTypeFilters.push('storm');
        }
        if (document.getElementById('type-wind') && !document.getElementById('type-wind').checked) {
            eventTypeFilters.push('wind');
        }
        if (document.getElementById('type-rain') && !document.getElementById('type-rain').checked) {
            eventTypeFilters.push('rain');
        }
        if (document.getElementById('type-hail') && !document.getElementById('type-hail').checked) {
            eventTypeFilters.push('hail');
        }
    } catch (e) {
        console.warn('Could not read event type filters:', e);
    }
    
    // Time slider filter
    let maxDate = null;
    if (window.visualizationOptions.events.timeSlider && typeof timeValue === 'number' && window.timeRange) {
        // Calculate date based on slider value
        const totalMs = window.timeRange.end.getTime() - window.timeRange.start.getTime();
        const currentMs = totalMs * (timeValue / 100);
        maxDate = new Date(window.timeRange.start.getTime() + currentMs);
    }
    
    // Process historical events
    let count = 0;
    window.historicalData.forEach(event => {
        // Extract coordinates
        const lat = parseFloat(event.Latitude || event.latitude || 0);
        const lng = parseFloat(event.Longitude || event.longitude || 0);
        
        if (!isNaN(lat) && !isNaN(lng)) {
            // Get event date
            const eventDate = new Date(event.Date || event['Date/Time'] || event.date || 0);
            
            // Check if event is before max date if time filtering is active
            if (maxDate && eventDate > maxDate) return;
            
            // Determine marker icon based on event type/database
            let iconColor, eventType;

            // Use Database field for event type (new approach based on 1980-2025.csv)
            if (event.Database) {
                const databaseStr = (event.Database || '').toLowerCase();
                
                if (databaseStr.includes('wind')) {
                    iconColor = '#3388ff'; // Blue for wind events
                    eventType = 'Wind Event';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'wind') || eventTypeFilters.includes('wind')) return;
                } else if (databaseStr.includes('rain')) {
                    iconColor = '#00a651'; // Green for rain events
                    eventType = 'Rain Event';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'rain') || eventTypeFilters.includes('rain')) return;
                } else if (databaseStr.includes('hail')) {
                    iconColor = '#9933cc'; // Purple for hail events
                    eventType = 'Hail Event';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'hail') || eventTypeFilters.includes('hail')) return;
                } else if (databaseStr.includes('fire')) {
                    iconColor = '#ff3333'; // Red for fires
                    eventType = 'Fire Event';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'fire') || eventTypeFilters.includes('fire')) return;
                } else if (databaseStr.includes('flood')) {
                    iconColor = '#00aeef'; // Light blue for floods
                    eventType = 'Flood Event';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'flood') || eventTypeFilters.includes('flood')) return;
                } else {
                    iconColor = '#ff9900'; // Orange for other events
                    eventType = event.Database || 'Weather Event';
                    // Skip if filtered by filter dropdown
                    if (eventFilter !== 'all') return;
                }
            } 
            // Fallback to old approach if Database field isn't available
            else if (event.Type || event.type) {
                const typeStr = (event.Type || event.type || '').toLowerCase();
                
                if (typeStr.includes('flood')) {
                    iconColor = '#00aeef'; // Light blue for floods
                    eventType = 'Flood';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'flood') || eventTypeFilters.includes('flood')) return;
                } else if (typeStr.includes('cyclon') || typeStr.includes('storm')) {
                    iconColor = '#9933cc'; // Purple for cyclones and storms
                    eventType = 'Cyclone/Storm';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'cyclone') || eventTypeFilters.includes('cyclone') || eventTypeFilters.includes('storm')) return;
                } else if (typeStr.includes('fire')) {
                    iconColor = '#ff3333'; // Red for fires
                    eventType = 'Fire';
                    // Skip if filtered by filter dropdown or checkboxes
                    if ((eventFilter !== 'all' && eventFilter !== 'fire') || eventTypeFilters.includes('fire')) return;
                } else {
                    iconColor = '#ff9900'; // Orange for other events
                    eventType = event.Type || event.type || 'Weather Event';
                    // Skip if filtered by filter dropdown
                    if (eventFilter !== 'all') return;
                }
            } else {
                iconColor = '#ff9900'; // Orange for unknown events
                eventType = 'Weather Event';
                // Skip if filtered by filter dropdown
                if (eventFilter !== 'all') return;
            }
            
            // Determine marker size based on event severity if enabled
            let markerRadius = 6; // Default size
            if (sizeByEvent) {
                const severity = event.Severity || event.severity || event.Magnitude || event.magnitude || '';
                if (severity) {
                    // Try to parse severity as a number
                    const severityNum = parseFloat(severity);
                    if (!isNaN(severityNum)) {
                        markerRadius = Math.min(Math.max(severityNum * 2, 5), 12);
                    } else if (typeof severity === 'string') {
                        // Handle text severities
                        if (severity.toLowerCase().includes('high') || severity.toLowerCase().includes('major')) {
                            markerRadius = 10;
                        } else if (severity.toLowerCase().includes('medium') || severity.toLowerCase().includes('moderate')) {
                            markerRadius = 7;
                        }
                    }
                }
            }
            
            // Create marker
            const marker = L.circleMarker([lat, lng], {
                radius: markerRadius,
                color: '#000',
                fillColor: iconColor,
                fillOpacity: 0.8,
                weight: 1
            });
            
            // Create popup with all event details from the 1980-2025.csv file
            // Headers: Event ID, Database, ID, Date/Time, Nearest town, State, Latitude, Longitude, Comments
            
            const popupContent = `
                <div style="max-width: 400px;">
                    <h5>${eventType}</h5>
                    <table class="table table-sm table-bordered">
                        <tbody>
                            <tr>
                                <th>Event ID</th>
                                <td>${event['Event ID'] || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Database</th>
                                <td>${event.Database || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>ID</th>
                                <td>${event.ID || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Date/Time</th>
                                <td>${event['Date/Time'] || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Nearest town</th>
                                <td>${event['Nearest town'] || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>State</th>
                                <td>${event.State || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Latitude</th>
                                <td>${event.Latitude || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Longitude</th>
                                <td>${event.Longitude || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Comments</th>
                                <td>${event.Comments || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Add to events layer
            window.layers.events.addLayer(marker);
            count++;
        }
    });
    
    // Add layer to map
    window.map.addLayer(window.layers.events);
    
    // Update total count if time slider is active
    if (maxDate) {
        showToast(`Showing ${count} events up to ${maxDate.toLocaleDateString()}`);
    }
    
    return count;
}

// Update flood warnings visualization
function updateFloodWarningsVisualization() {
    if (!window.floodWarningsData || !window.map) {
        console.warn('Cannot update flood warnings visualization: missing flood warnings data or map');
        return;
    }
    
    console.log('Updating flood warnings visualization with', window.floodWarningsData.length, 'warnings');
    
    // Remove existing flood layers
    if (window.floodWarningLayer) {
        window.map.removeLayer(window.floodWarningLayer);
    }
    
    // Reset and create new flood warning layer
    window.floodWarningLayer = L.layerGroup();
    
    // If not visible, return
    if (!window.visualizationOptions.floodWarnings.visible) return;
    
    // Get visualization options
    const visType = window.visualizationOptions.floodWarnings.visType;
    const colorBySeverity = window.visualizationOptions.floodWarnings.color === 'yes';
    
    // Process flood warnings
    window.floodWarningsData.forEach(warning => {
        let centerLat, centerLng;
        
        if (warning.state === 'Queensland') {
            centerLat = -23.5 + (Math.random() * 2 - 1);
            centerLng = 144.0 + (Math.random() * 2 - 1);
        } else if (warning.state === 'New South Wales') {
            centerLat = -32.0 + (Math.random() * 2 - 1);
            centerLng = 147.0 + (Math.random() * 2 - 1);
        } else {
            centerLat = -25.0 + (Math.random() * 2 - 1);
            centerLng = 134.0 + (Math.random() * 2 - 1);
        }
        
        // Determine color based on severity if option is enabled
        let color = '#f03'; // Default red
        if (colorBySeverity && warning.severity) {
            if (warning.severity.toLowerCase() === 'severe') {
                color = '#dc3545'; // Dark red
            } else if (warning.severity.toLowerCase() === 'moderate') {
                color = '#ffc107'; // Yellow
            } else if (warning.severity.toLowerCase() === 'minor') {
                color = '#28a745'; // Green
            }
        }
        
        // Visualization based on selected type
        if (visType === 'circles') {
            // Create a circular area based on polygons_count
            const radius = warning.polygons_count ? Math.max(warning.polygons_count * 5000, 20000) : 50000;
            
            const circle = L.circle([centerLat, centerLng], {
                radius: radius,
                color: color,
                fillColor: color,
                fillOpacity: 0.3
            });
            
            // Create popup content
            const popupContent = `
                <div style="max-width: 300px;">
                    <h5>${warning.headline || 'Flood Warning'}</h5>
                    <p><strong>Location:</strong> ${warning.state || 'Unknown'}</p>
                    <p><strong>Severity:</strong> ${warning.severity || 'Unknown'}</p>
                    <p><strong>Start:</strong> ${warning.start || 'Unknown'}</p>
                    <p><strong>End:</strong> ${warning.end || 'Unknown'}</p>
                    <p>${warning.description || ''}</p>
                    <p class="text-danger"><strong>Instruction:</strong> ${warning.instruction || 'Follow local emergency instructions'}</p>
                </div>
            `;
            
            // Bind popup to circle
            circle.bindPopup(popupContent);
            
            // Add to layer
            window.floodWarningLayer.addLayer(circle);
            
        } else if (visType === 'markers') {
            // Create marker
            const marker = L.circleMarker([centerLat, centerLng], {
                radius: 8,
                fillColor: color,
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
            
            // Create popup content
            const popupContent = `
                <div style="max-width: 300px;">
                    <h5>${warning.headline || 'Flood Warning'}</h5>
                    <p><strong>Location:</strong> ${warning.state || 'Unknown'}</p>
                    <p><strong>Severity:</strong> ${warning.severity || 'Unknown'}</p>
                    <p><strong>Start:</strong> ${warning.start || 'Unknown'}</p>
                    <p><strong>End:</strong> ${warning.end || 'Unknown'}</p>
                    <p>${warning.description || ''}</p>
                    <p class="text-danger"><strong>Instruction:</strong> ${warning.instruction || 'Follow local emergency instructions'}</p>
                </div>
            `;
            
            // Bind popup to marker
            marker.bindPopup(popupContent);
            
            // Add to layer
            window.floodWarningLayer.addLayer(marker);
            
        } else if (visType === 'heatmap' && typeof L.heatLayer === 'function') {
            // This is a bit different since we need to collect all points first
            // We'll add random points around the warning center
            
            // We'll handle this later by calling updateFloodHeatmap
            updateFloodHeatmap();
            return;
        }
    });
    
    // Add layer to map (except for heatmap which is added separately)
    if (visType !== 'heatmap') {
        window.map.addLayer(window.floodWarningLayer);
    }
}

// Special function to update flood heatmap
function updateFloodHeatmap() {
    if (!window.floodWarningsData || !window.map) return;
    
    // Remove any existing heatmap layer
    if (window.floodHeatmapLayer && window.map.hasLayer(window.floodHeatmapLayer)) {
        window.map.removeLayer(window.floodHeatmapLayer);
    }
    
    // If not visible, return
    if (!window.visualizationOptions.floodWarnings.visible) return;
    
    // Only proceed if heatmap is the selected visualization type
    if (window.visualizationOptions.floodWarnings.visType !== 'heatmap') return;
    
    // Check if heatLayer function exists
    if (typeof L.heatLayer !== 'function') {
        console.warn('L.heatLayer is not available');
        showToast('Heatmap plugin not available. Using circles instead.');
        
        // Fallback to circles
        window.visualizationOptions.floodWarnings.visType = 'circles';
        updateFloodWarningsVisualization();
        return;
    }
    
    // Create points array for heatmap
    const heatPoints = [];
    
    // Process flood warnings
    window.floodWarningsData.forEach(warning => {
        let centerLat, centerLng;
        
        if (warning.state === 'Queensland') {
            centerLat = -23.5;
            centerLng = 144.0;
        } else if (warning.state === 'New South Wales') {
            centerLat = -32.0;
            centerLng = 147.0;
        } else {
            centerLat = -25.0;
            centerLng = 134.0;
        }
        
        // Determine intensity based on severity
        let intensity = 0.7; // Default
        if (warning.severity) {
            if (warning.severity.toLowerCase() === 'severe') {
                intensity = 1;
            } else if (warning.severity.toLowerCase() === 'moderate') {
                intensity = 0.7;
            } else if (warning.severity.toLowerCase() === 'minor') {
                intensity = 0.4;
            }
        }
        
        // Add some randomness to spread out points
        for (let i = 0; i < 10; i++) {
            const lat = centerLat + (Math.random() * 4 - 2);
            const lng = centerLng + (Math.random() * 4 - 2);
            heatPoints.push([lat, lng, intensity]);
        }
    });
    
    // Create heatmap layer
    window.floodHeatmapLayer = L.heatLayer(heatPoints, {
        radius: 50,  // Increased from 25
        blur: 30,    // Increased from 15
        maxZoom: 10,
        gradient: {0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red'}
    });
    
    // Add to map
    window.map.addLayer(window.floodHeatmapLayer);
}

// Update flood polygons visualization
function updateFloodPolygonsVisualization() {
    if (!window.floodPolygonsData || !window.map) {
        console.warn('Cannot update flood polygons visualization: missing flood polygons data or map');
        return;
    }
    
    console.log('Updating flood polygons visualization with', window.floodPolygonsData.features ? window.floodPolygonsData.features.length : 0, 'polygons');
    
    // Remove existing flood polygon layer
    if (window.floodPolygonLayer) {
        window.map.removeLayer(window.floodPolygonLayer);
    }
    
    // Reset and create new flood polygon layer
    window.floodPolygonLayer = L.layerGroup();
    
    // If not visible, return
    if (!window.visualizationOptions.floodPolygons.visible) return;
    
    // Get visualization options
    const opacity = window.visualizationOptions.floodPolygons.opacity;
    const weight = window.visualizationOptions.floodPolygons.weight;
    
    // Process flood polygons
    if (window.floodPolygonsData.features) {
        const geoJsonLayer = L.geoJSON(window.floodPolygonsData, {
            style: function(feature) {
                return {
                    fillColor: '#dc3545',
                    weight: weight,
                    opacity: 1,
                    color: '#9c2a33',
                    fillOpacity: opacity
                };
            },
            onEachFeature: function(feature, layer) {
                if (feature.properties) {
                    const popupContent = `
                        <div style="max-width: 300px;">
                            <h5>${feature.properties.headline || 'Flood Area'}</h5>
                            <p><strong>Location:</strong> ${feature.properties.name || 'Unknown'}</p>
                            <p><strong>Severity:</strong> ${feature.properties.severity || 'Unknown'}</p>
                            <p>${feature.properties.description || ''}</p>
                        </div>
                    `;
                    
                    layer.bindPopup(popupContent);
                }
            }
        });
        
        window.floodPolygonLayer.addLayer(geoJsonLayer);
    }
    
    // Add to map
    window.map.addLayer(window.floodPolygonLayer);
}

// Time Slider Functions

// Update time slider display
function updateTimeSliderDisplay() {
    const slider = document.getElementById('time-slider');
    const dateDisplay = document.getElementById('current-date');
    
    if (!slider || !dateDisplay || !window.timeRange) return;
    
    // Calculate date based on slider value
    const value = parseInt(slider.value);
    const totalMs = window.timeRange.end.getTime() - window.timeRange.start.getTime();
    const currentMs = totalMs * (value / 100);
    const currentDate = new Date(window.timeRange.start.getTime() + currentMs);
    
    // Update date display
    dateDisplay.textContent = currentDate.toLocaleDateString();
    
    // Update events based on time slider
    updateEventsVisualization(value);
}

// Start time slider animation
function playTimeSlider() {
    const slider = document.getElementById('time-slider');
    const playBtn = document.getElementById('play-time-slider');
    
    if (!slider || !playBtn) return;
    
    // Toggle play state
    if (window.timeSliderInterval) {
        // Stop animation
        clearInterval(window.timeSliderInterval);
        window.timeSliderInterval = null;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        return;
    }
    
    // Start animation
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    
    // Reset to beginning if at end
    if (parseInt(slider.value) >= 100) {
        slider.value = 0;
    }
    
    // Start interval
    window.timeSliderInterval = setInterval(() => {
        // Increment slider value
        slider.value = parseInt(slider.value) + 1;
        
        // Update display
        updateTimeSliderDisplay();
        
        // Stop at end
        if (parseInt(slider.value) >= 100) {
            clearInterval(window.timeSliderInterval);
            window.timeSliderInterval = null;
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }, 300);
}