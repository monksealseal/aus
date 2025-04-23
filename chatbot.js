// Chatbot functionality for the ESG & Flood Risk Dashboard
// Allows natural language control of dashboard features

// Global variables for chatbot
window.chatbotActive = false;
window.chatHistory = [];

// Initialize the chatbot
function initChatbot() {
    // Create the chatbot UI if it doesn't exist
    if (!document.getElementById('chatbot-container')) {
        createChatbotUI();
    }

    // Set up event listeners
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle');

    if (chatbotSendBtn) {
        // Send button event
        chatbotSendBtn.addEventListener('click', function() {
            sendChatbotMessage();
        });
    }

    if (chatbotInput) {
        // Enter key event
        chatbotInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatbotMessage();
            }
        });
    }

    if (chatbotToggleBtn) {
        // Toggle chatbot visibility
        chatbotToggleBtn.addEventListener('click', function() {
            toggleChatbot();
        });
    }

    // Add welcome message
    addChatbotMessage('Assistant', 'Hello Sophie! 👋 I\'m your dashboard assistant. I can help you explore Australian flood risk data for your ESG presentation. Try asking me to "show rainfall data", "run a demo", or say "help" for more options.');
    
    // Auto-open after a short delay for the demo
    setTimeout(() => {
        toggleChatbot(true);
    }, 2000);
}

// Create the chatbot UI
function createChatbotUI() {
    // Create the container
    const chatbotContainer = document.createElement('div');
    chatbotContainer.id = 'chatbot-container';
    chatbotContainer.className = 'chatbot-container';
    
    // Create the toggle button (fixed position)
    const chatbotToggleBtn = document.createElement('button');
    chatbotToggleBtn.id = 'chatbot-toggle';
    chatbotToggleBtn.className = 'chatbot-toggle-btn';
    chatbotToggleBtn.innerHTML = '<i class="fas fa-robot"></i>';
    chatbotToggleBtn.title = 'Toggle Chatbot Assistant';
    
    // Create the chatbot panel
    const chatbotPanel = document.createElement('div');
    chatbotPanel.id = 'chatbot-panel';
    chatbotPanel.className = 'chatbot-panel';
    chatbotPanel.style.display = 'none';
    
    // Create the header
    const chatbotHeader = document.createElement('div');
    chatbotHeader.className = 'chatbot-header';
    chatbotHeader.innerHTML = `
        <h4><i class="fas fa-robot me-2"></i>Dashboard Assistant</h4>
        <button class="chatbot-close-btn" id="chatbot-close"><i class="fas fa-times"></i></button>
    `;
    
    // Create the chat area
    const chatbotMessages = document.createElement('div');
    chatbotMessages.id = 'chatbot-messages';
    chatbotMessages.className = 'chatbot-messages';
    
    // Create the input area
    const chatbotInputArea = document.createElement('div');
    chatbotInputArea.className = 'chatbot-input-area';
    chatbotInputArea.innerHTML = `
        <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Type a command...">
        <button id="chatbot-send" class="chatbot-send-btn"><i class="fas fa-paper-plane"></i></button>
    `;
    
    // Assemble the chatbot panel
    chatbotPanel.appendChild(chatbotHeader);
    chatbotPanel.appendChild(chatbotMessages);
    chatbotPanel.appendChild(chatbotInputArea);
    
    // Add all elements to the container
    chatbotContainer.appendChild(chatbotToggleBtn);
    chatbotContainer.appendChild(chatbotPanel);
    
    // Add the container to the document body
    document.body.appendChild(chatbotContainer);
    
    // Add close button event
    document.getElementById('chatbot-close').addEventListener('click', function() {
        toggleChatbot(false);
    });
}

// Toggle chatbot visibility
function toggleChatbot(forceState) {
    const chatbotPanel = document.getElementById('chatbot-panel');
    const chatbotToggleBtn = document.getElementById('chatbot-toggle');
    
    if (forceState !== undefined) {
        window.chatbotActive = forceState;
    } else {
        window.chatbotActive = !window.chatbotActive;
    }
    
    if (window.chatbotActive) {
        chatbotPanel.style.display = 'flex';
        chatbotToggleBtn.classList.add('active');
        // Focus on input
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 100);
    } else {
        chatbotPanel.style.display = 'none';
        chatbotToggleBtn.classList.remove('active');
    }
}

// Send a message to the chatbot
function sendChatbotMessage() {
    const chatbotInput = document.getElementById('chatbot-input');
    const message = chatbotInput.value.trim();
    
    if (message) {
        // Add the user message to the chat
        addChatbotMessage('User', message);
        
        // Clear the input
        chatbotInput.value = '';
        
        // Process the message
        processChatbotMessage(message);
    }
}

// Add a message to the chatbot window
function addChatbotMessage(sender, message) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'User' ? 'chatbot-message user-message' : 'chatbot-message assistant-message';
    
    // Format links in assistant messages
    if (sender === 'Assistant') {
        message = formatChatbotLinks(message);
    }
    
    messageElement.innerHTML = `
        <div class="message-content">
            <div class="message-sender">${sender}</div>
            <div class="message-text">${message}</div>
        </div>
    `;
    
    // Add to the chat area
    chatbotMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    
    // Store in history
    window.chatHistory.push({
        sender: sender,
        message: message
    });
}

// Format links in chatbot messages
function formatChatbotLinks(message) {
    // Convert action links [action:command] to clickable buttons
    message = message.replace(/\[action:(.*?)\]/g, function(match, command) {
        return `<button class="chatbot-action-btn" onclick="executeChatbotCommand('${command}')">${command}</button>`;
    });
    
    return message;
}

// Process a message from the user
function processChatbotMessage(message) {
    // Convert to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Simulate thinking
    setTimeout(() => {
        // Demo mode for the meeting with Sophie
        if (lowerMessage.includes('demo') || lowerMessage.includes('presentation') || lowerMessage.includes('showcase')) {
            runChatbotDemo();
            return;
        }
        
        // Help commands
        if (lowerMessage === 'help' || lowerMessage.includes('what can you do')) {
            showChatbotHelp();
            return;
        }
        
        // Map view commands
        if (lowerMessage.includes('show map') || lowerMessage.includes('view map')) {
            addChatbotMessage('Assistant', 'Here\'s the map view. What would you like to see on it?');
            return;
        }
        
        // Time slider commands
        if (lowerMessage.includes('play time') || lowerMessage.includes('start animation')) {
            executeChatbotCommand('playTimeSlider');
            addChatbotMessage('Assistant', 'Started time animation. You can see events appear chronologically.');
            return;
        }
        
        if (lowerMessage.includes('stop time') || lowerMessage.includes('pause animation')) {
            executeChatbotCommand('stopTimeSlider');
            addChatbotMessage('Assistant', 'Stopped time animation.');
            return;
        }
        
        if (lowerMessage.includes('reset time') || lowerMessage.includes('time to beginning')) {
            executeChatbotCommand('resetTimeSlider');
            addChatbotMessage('Assistant', 'Reset time slider to the beginning (1980).');
            return;
        }
        
        // Data visualization commands
        if (lowerMessage.includes('show rainfall') || lowerMessage.includes('display rainfall')) {
            executeChatbotCommand('showRainfall');
            addChatbotMessage('Assistant', 'Showing rainfall data on the map. Would you like to change how it\'s displayed? Try [action:heatmap], [action:markers], or [action:circles].');
            return;
        }
        
        if (lowerMessage.includes('show flood warnings') || lowerMessage.includes('display warnings')) {
            executeChatbotCommand('showFloodWarnings');
            addChatbotMessage('Assistant', 'Showing flood warnings on the map.');
            return;
        }
        
        if (lowerMessage.includes('show flood polygons') || lowerMessage.includes('display flood areas')) {
            executeChatbotCommand('showFloodPolygons');
            addChatbotMessage('Assistant', 'Showing flood polygon areas on the map.');
            return;
        }
        
        if (lowerMessage.includes('show historical') || lowerMessage.includes('show events')) {
            executeChatbotCommand('showHistoricalEvents');
            addChatbotMessage('Assistant', 'Showing historical events on the map. You can filter by type: [action:show all events], [action:show floods], [action:show cyclones], or [action:show fires].');
            return;
        }
        
        // Visualization style commands
        if (lowerMessage.includes('heatmap')) {
            executeChatbotCommand('heatmap');
            addChatbotMessage('Assistant', 'Changed rainfall visualization to heatmap.');
            return;
        }
        
        if (lowerMessage.includes('markers')) {
            executeChatbotCommand('markers');
            addChatbotMessage('Assistant', 'Changed visualization to markers.');
            return;
        }
        
        if (lowerMessage.includes('circles')) {
            executeChatbotCommand('circles');
            addChatbotMessage('Assistant', 'Changed visualization to circles.');
            return;
        }
        
        // Filter commands
        if (lowerMessage.includes('show all events')) {
            executeChatbotCommand('filterAllEvents');
            addChatbotMessage('Assistant', 'Showing all event types.');
            return;
        }
        
        if (lowerMessage.includes('show floods') || lowerMessage.includes('filter floods')) {
            executeChatbotCommand('filterFloodEvents');
            addChatbotMessage('Assistant', 'Filtering to show only flood events.');
            return;
        }
        
        if (lowerMessage.includes('show cyclones') || lowerMessage.includes('filter cyclones')) {
            executeChatbotCommand('filterCycloneEvents');
            addChatbotMessage('Assistant', 'Filtering to show only cyclone events.');
            return;
        }
        
        if (lowerMessage.includes('show fires') || lowerMessage.includes('filter fires')) {
            executeChatbotCommand('filterFireEvents');
            addChatbotMessage('Assistant', 'Filtering to show only fire events.');
            return;
        }
        
        // Panel commands
        if (lowerMessage.includes('open data panel') || lowerMessage.includes('show data panel')) {
            executeChatbotCommand('openDataPanel');
            addChatbotMessage('Assistant', 'Opened the data panel. You can upload and configure data files here.');
            return;
        }
        
        if (lowerMessage.includes('open esg panel') || lowerMessage.includes('show esg')) {
            executeChatbotCommand('openESGPanel');
            addChatbotMessage('Assistant', 'Opened the ESG analysis panel.');
            return;
        }
        
        if (lowerMessage.includes('open layer') || lowerMessage.includes('show layers')) {
            executeChatbotCommand('openLayerPanel');
            addChatbotMessage('Assistant', 'Opened the layer control panel.');
            return;
        }
        
        if (lowerMessage.includes('open filter') || lowerMessage.includes('show filters')) {
            executeChatbotCommand('openFilterPanel');
            addChatbotMessage('Assistant', 'Opened the filter panel.');
            return;
        }
        
        if (lowerMessage.includes('open time slider') || lowerMessage.includes('show time slider')) {
            executeChatbotCommand('openTimeSlider');
            addChatbotMessage('Assistant', 'Opened the time slider. You can [action:play time slider] or adjust it manually.');
            return;
        }
        
        if (lowerMessage.includes('close panel') || lowerMessage.includes('hide panel')) {
            executeChatbotCommand('closePanels');
            addChatbotMessage('Assistant', 'Closed all open panels.');
            return;
        }
        
        // Location commands
        if (lowerMessage.includes('go to') || lowerMessage.includes('show location')) {
            const locationMatch = message.match(/(?:go to|show|view|find)\s+(.+)/i);
            if (locationMatch && locationMatch[1]) {
                const locationName = locationMatch[1].trim();
                goToNamedLocation(locationName);
                addChatbotMessage('Assistant', `Moving to ${locationName}.`);
                return;
            }
        }
        
        // Fallback response
        addChatbotMessage('Assistant', 'I\'m not sure how to do that yet. Try "help" to see what I can do.');
    }, 500);
}

// Show help message with available commands
function showChatbotHelp() {
    const helpMessage = `
        Here's what I can help you with:

        <strong>View Controls:</strong>
        - "Show map" - Focus on the map
        - "Go to [location]" - Navigate to a location

        <strong>Data Visualization:</strong>
        - "Show rainfall data" - Display rainfall
        - "Show flood warnings" - Display flood warnings
        - "Show flood polygons" - Display flood areas
        - "Show historical events" - Display historical events

        <strong>Visualization Styles:</strong>
        - "Heatmap" - Show data as heatmap
        - "Markers" - Show data as markers
        - "Circles" - Show data as circles

        <strong>Time Controls:</strong>
        - "Play time slider" - Animate events over time
        - "Stop time slider" - Pause animation
        - "Reset time slider" - Go back to beginning

        <strong>Panels:</strong>
        - "Open data panel" - Open data upload panel
        - "Open ESG panel" - Open ESG analysis
        - "Open layer panel" - Open layer controls
        - "Close panels" - Close all open panels

        <strong>Filters:</strong>
        - "Show all events" - Display all event types
        - "Show floods" - Filter to flood events
        - "Show cyclones" - Filter to cyclone events
        - "Show fires" - Filter to fire events
    `;
    
    addChatbotMessage('Assistant', helpMessage);
}

// Execute a command from the chatbot
function executeChatbotCommand(command) {
    console.log('Executing command:', command);
    
    // Make sure data is loaded before executing visualization commands
    if (['showRainfall', 'showHistoricalEvents', 'showFloodWarnings', 'showFloodPolygons'].includes(command)) {
        loadDemoData();
    }
    
    switch(command) {
        // Time slider commands
        case 'playTimeSlider':
            if (typeof playTimeSlider === 'function') {
                playTimeSlider();
            } else if (typeof window.playTimeSlider === 'function') {
                window.playTimeSlider();
            } else {
                const playBtn = document.getElementById('play-time-slider');
                if (playBtn) playBtn.click();
            }
            break;
            
        case 'stopTimeSlider':
            if (window.timeSliderInterval) {
                clearInterval(window.timeSliderInterval);
                window.timeSliderInterval = null;
                const playBtn = document.getElementById('play-time-slider');
                if (playBtn) playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            break;
            
        case 'resetTimeSlider':
            const timeSlider = document.getElementById('time-slider');
            if (timeSlider) {
                timeSlider.value = 0;
                if (typeof updateTimeSliderDisplay === 'function') {
                    updateTimeSliderDisplay();
                }
            }
            break;
            
        // Visualization commands
        case 'showRainfall':
            updateVisualizationOption('rainfall', 'visible', true);
            updateRainfallVisualization();
            break;
            
        case 'showFloodWarnings':
            updateVisualizationOption('floodWarnings', 'visible', true);
            updateFloodWarningsVisualization();
            break;
            
        case 'showFloodPolygons':
            updateVisualizationOption('floodPolygons', 'visible', true);
            updateFloodPolygonsVisualization();
            break;
            
        case 'showHistoricalEvents':
            updateVisualizationOption('events', 'visible', true);
            updateEventsVisualization();
            break;
            
        // Visualization style commands
        case 'heatmap':
            updateVisualizationOption('rainfall', 'visType', 'heatmap');
            updateRainfallVisualization();
            break;
            
        case 'markers':
            updateVisualizationOption('rainfall', 'visType', 'markers');
            updateRainfallVisualization();
            break;
            
        case 'circles':
            updateVisualizationOption('rainfall', 'visType', 'circles');
            updateRainfallVisualization();
            break;
            
        // Filter commands
        case 'filterAllEvents':
            updateVisualizationOption('events', 'filter', 'all');
            updateEventsVisualization();
            break;
            
        case 'filterFloodEvents':
            updateVisualizationOption('events', 'filter', 'flood');
            updateEventsVisualization();
            break;
            
        case 'filterCycloneEvents':
            updateVisualizationOption('events', 'filter', 'cyclone');
            updateEventsVisualization();
            break;
            
        case 'filterFireEvents':
            updateVisualizationOption('events', 'filter', 'fire');
            updateEventsVisualization();
            break;
            
        // Panel commands
        case 'openDataPanel':
            document.getElementById('data-btn').click();
            break;
            
        case 'openESGPanel':
            document.getElementById('esg-btn').click();
            break;
            
        case 'openLayerPanel':
            document.getElementById('layer-btn').click();
            break;
            
        case 'openFilterPanel':
            document.getElementById('filter-btn').click();
            break;
            
        case 'openTimeSlider':
            document.getElementById('time-btn').click();
            break;
            
        case 'closePanels':
            // Close all visible panels
            const panelButtons = ['data-btn', 'esg-btn', 'layer-btn', 'filter-btn', 'time-btn'];
            panelButtons.forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (btn && btn.classList.contains('active')) {
                    btn.click();
                }
            });
            break;
    }
    
    // Update UI elements to reflect new state
    updateUIForCommand(command);
}

// Update visualization options from chatbot
function updateVisualizationOption(category, option, value) {
    if (window.visualizationOptions && window.visualizationOptions[category]) {
        window.visualizationOptions[category][option] = value;
        
        // Update UI controls to match
        const controlId = `${category}-${option === 'visType' ? 'vis-type' : option}`;
        const control = document.getElementById(controlId);
        
        if (control) {
            if (control.type === 'checkbox') {
                control.checked = value;
            } else if (control.tagName === 'SELECT') {
                control.value = value;
            }
        }
    }
}

// Update UI elements to reflect command state
function updateUIForCommand(command) {
    // Implement if needed to update UI elements like button states
}

// Navigate to a named location
function goToNamedLocation(locationName) {
    const lowerName = locationName.toLowerCase();
    let coords, zoom;
    
    // Common Australian locations
    if (lowerName.includes('sydney')) {
        coords = [-33.8688, 151.2093];
        zoom = 10;
    } else if (lowerName.includes('melbourne')) {
        coords = [-37.8136, 144.9631];
        zoom = 10;
    } else if (lowerName.includes('brisbane')) {
        coords = [-27.4698, 153.0251];
        zoom = 10;
    } else if (lowerName.includes('perth')) {
        coords = [-31.9505, 115.8605];
        zoom = 10;
    } else if (lowerName.includes('adelaide')) {
        coords = [-34.9285, 138.6007];
        zoom = 10;
    } else if (lowerName.includes('canberra')) {
        coords = [-35.2809, 149.1300];
        zoom = 10;
    } else if (lowerName.includes('darwin')) {
        coords = [-12.4634, 130.8456];
        zoom = 10;
    } else if (lowerName.includes('hobart')) {
        coords = [-42.8821, 147.3272];
        zoom = 10;
    } else if (lowerName.includes('gold coast')) {
        coords = [-28.0167, 153.4000];
        zoom = 10;
    } else if (lowerName.includes('newcastle')) {
        coords = [-32.9283, 151.7817];
        zoom = 10;
    } else if (lowerName.includes('australia')) {
        coords = [-25.2744, 133.7751];
        zoom = 4;
    } else if (lowerName.includes('queensland') || lowerName.includes('qld')) {
        coords = [-23.5, 144.0];
        zoom = 6;
    } else if (lowerName.includes('new south') || lowerName.includes('nsw')) {
        coords = [-32.0, 147.0];
        zoom = 6;
    } else if (lowerName.includes('victoria') || lowerName.includes('vic')) {
        coords = [-37.0, 144.0];
        zoom = 7;
    } else if (lowerName.includes('western australia') || lowerName.includes('wa')) {
        coords = [-27.0, 122.0];
        zoom = 5;
    } else {
        // Default to Australia
        coords = [-25.2744, 133.7751];
        zoom = 4;
    }
    
    // Set the map view
    if (window.map) {
        window.map.setView(coords, zoom);
    }
}

// Add a notification when a chatbot action completes
function notifyChatbotAction(message) {
    addChatbotMessage('Assistant', message);
}

// Load demo data for visualizations
function loadDemoData() {
    // Check if data is already loaded
    if (window.rainfallData && window.rainfallData.length > 0 &&
        window.historicalData && window.historicalData.length > 0 &&
        window.floodWarningsData && window.floodWarningsData.length > 0 &&
        window.floodPolygonsData) {
        console.log('Demo data already loaded');
        return;
    }
    
    console.log('Loading demo data for visualizations...');
    
    // Load rainfall data from CSV
    fetch('rainfall.2025-03-31.12month.aus.csv')
        .then(response => response.text())
        .then(csvText => {
            // Use Papa Parse to parse CSV
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    window.rainfallData = results.data;
                    console.log('Rainfall data loaded:', window.rainfallData.length);
                }
            });
        })
        .catch(error => console.error('Error loading rainfall data:', error));
    
    // Load historical events data from CSV
    fetch('1980-2025.csv')
        .then(response => response.text())
        .then(csvText => {
            // Use Papa Parse to parse CSV
            Papa.parse(csvText, {
                header: true,
                complete: function(results) {
                    window.historicalData = results.data;
                    console.log('Historical data loaded:', window.historicalData.length);
                    
                    // Sort by date
                    try {
                        window.historicalData.sort((a, b) => {
                            const dateA = new Date(a.Date || a['Date/Time'] || a.date || 0);
                            const dateB = new Date(b.Date || b['Date/Time'] || b.date || 0);
                            return dateA - dateB;
                        });
                    } catch (e) {
                        console.warn('Could not sort historical data by date:', e);
                    }
                    
                    // Set time range for slider
                    if (window.historicalData.length > 0) {
                        const firstDate = new Date(window.historicalData[0].Date || window.historicalData[0]['Date/Time'] || '1980-01-01');
                        const lastDate = new Date(window.historicalData[window.historicalData.length - 1].Date || 
                                                window.historicalData[window.historicalData.length - 1]['Date/Time'] || '2025-04-01');
                        
                        window.timeRange = {
                            start: firstDate,
                            end: lastDate
                        };
                    }
                }
            });
        })
        .catch(error => console.error('Error loading historical data:', error));
    
    // Load flood warnings data from JSON
    fetch('flood_warnings.json')
        .then(response => response.json())
        .then(data => {
            window.floodWarningsData = data;
            console.log('Flood warnings data loaded:', window.floodWarningsData.length);
        })
        .catch(error => console.error('Error loading flood warnings:', error));
    
    // Load flood polygons data from JSON
    fetch('flood_warning_polygons.json')
        .then(response => response.json())
        .then(data => {
            window.floodPolygonsData = data;
            console.log('Flood polygons data loaded:', data.features ? data.features.length : 0);
        })
        .catch(error => console.error('Error loading flood polygons:', error));
    
    // Initialize visualization options if not already set
    if (!window.visualizationOptions) {
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
    }
    
    // Initialize layers if not already set
    if (!window.layers) {
        window.layers = {
            dailyRainfall: L.layerGroup(),
            twelveMonthRainfall: L.layerGroup(),
            thirtySixMonthRainfall: L.layerGroup(),
            events: L.layerGroup()
        };
    }
}

// Run a demo scenario for the meeting with Sophie
function runChatbotDemo() {
    addChatbotMessage('Assistant', '🌟 **Starting ESG & Flood Risk Dashboard Demo** 🌟\n\nI\'ll walk you through the key features of this dashboard we\'ve created for your ESG presentations, Sophie.\n\nLoading visualization data... please wait a moment.');
    
    // Load demo data if not already loaded
    loadDemoData();
    
    // Give data time to load before starting demo steps
    setTimeout(() => {
        addChatbotMessage('Assistant', 'Data loaded! Let\'s begin the demonstration.');
        startDemoSequence();
    }, 2000);
}

// Begin demo sequence after data is loaded
function startDemoSequence() {
    const demoSteps = [
        // PART 1: INTRODUCTION & MAP BASICS (45 seconds)
        {
            message: '**Part 1: Overview** - Welcome to the Australian Flood Risk & ESG Dashboard. This comprehensive tool integrates climate data with ESG metrics to provide actionable insights for your risk assessment needs.',
            command: null,
            delay: 5000
        },
        {
            message: 'First, let\'s get oriented with our map. The dashboard shows Australia with various data layers that can be toggled on and off.',
            command: null,
            delay: 3000
        },
        {
            message: 'Let\'s open the layer control panel to see what data we can display.',
            command: 'openLayerPanel',
            delay: 4000
        },
        {
            message: 'You can quickly navigate to any region of interest. For example, let\'s look at the entire Australian continent first.',
            command: function() { goToNamedLocation('Australia'); },
            delay: 3000
        },
        
        // PART 2: RAINFALL DATA (60 seconds)
        {
            message: '**Part 2: Rainfall Data** - Let\'s begin by examining rainfall patterns across Australia. This data forms the foundation of flood risk assessment.',
            command: 'showRainfall',
            delay: 4000
        },
        {
            message: 'By default, rainfall is displayed as a heatmap, showing intensity variations across regions.',
            command: null,
            delay: 3000
        },
        {
            message: 'We can change the visualization style. Let\'s switch to markers for a more precise view of station data.',
            command: 'markers',
            delay: 4000
        },
        {
            message: 'And now to circular areas, which help visualize coverage regions.',
            command: 'circles',
            delay: 4000
        },
        {
            message: 'Let\'s return to the heatmap view, which is often best for presentation purposes.',
            command: 'heatmap',
            delay: 3000
        },
        {
            message: 'We can focus on high-rainfall regions like Queensland. Note how the northeastern coast shows significantly higher precipitation.',
            command: function() { goToNamedLocation('Queensland'); },
            delay: 5000
        },
        
        // PART 3: HISTORICAL EVENTS (60 seconds)
        {
            message: '**Part 3: Historical Events** - Now let\'s examine historical extreme weather events across Australia. These records are critical for understanding patterns and trends.',
            command: 'showHistoricalEvents',
            delay: 5000
        },
        {
            message: 'Each point represents a major weather event. The dashboard allows filtering by event type.',
            command: null,
            delay: 3000
        },
        {
            message: 'Let\'s filter to show only flood events, which are particularly relevant for your ESG risk assessment.',
            command: 'filterFloodEvents',
            delay: 4000
        },
        {
            message: 'Now let\'s look at cyclones, which often trigger flooding in coastal regions.',
            command: 'filterCycloneEvents',
            delay: 4000
        },
        {
            message: 'And here are major fire events, which represent another climate risk factor.',
            command: 'filterFireEvents',
            delay: 4000
        },
        {
            message: 'Let\'s reset to show all events for a comprehensive view.',
            command: 'filterAllEvents',
            delay: 3000
        },
        
        // PART 4: TIME-BASED ANALYSIS (60 seconds)
        {
            message: '**Part 4: Temporal Analysis** - One of the dashboard\'s most powerful features is its ability to show how events have evolved over time.',
            command: 'resetTimeSlider',
            delay: 4000
        },
        {
            message: 'Let\'s open the time slider control to navigate through the historical data.',
            command: 'openTimeSlider',
            delay: 3000
        },
        {
            message: 'We\'ll now animate the events chronologically from 1980 to 2025. Watch how the pattern of extreme weather changes over the decades.',
            command: 'playTimeSlider',
            delay: 10000
        },
        {
            message: 'You can pause at any point to examine events from a specific time period. This is particularly useful for identifying trends and cycles.',
            command: 'stopTimeSlider',
            delay: 4000
        },
        {
            message: 'Note the increasing frequency of events in recent years - a key indicator of climate change impacts that should be addressed in ESG reporting.',
            command: null,
            delay: 5000
        },
        
        // PART 5: FLOOD WARNINGS & POLYGONS (60 seconds)
        {
            message: '**Part 5: Current Flood Risk** - Now let\'s examine current flood warnings and risk areas, essential for immediate risk assessment.',
            command: 'showFloodWarnings',
            delay: 5000
        },
        {
            message: 'The red circles indicate active flood warnings. The size corresponds to the affected area.',
            command: null,
            delay: 4000
        },
        {
            message: 'Let\'s also add the flood polygon overlays, which show the specific boundaries of flood-prone regions.',
            command: 'showFloodPolygons',
            delay: 5000
        },
        {
            message: 'These polygons are particularly valuable for property-level risk assessment and infrastructure planning.',
            command: null,
            delay: 3000
        },
        {
            message: 'Let\'s zoom to New South Wales to see the detailed flood warning areas in that region.',
            command: function() { goToNamedLocation('New South Wales'); },
            delay: 5000
        },
        
        // PART 6: DATA MANAGEMENT & UPLOADS (45 seconds)
        {
            message: '**Part 6: Data Management** - The dashboard allows you to upload and manage your own datasets for custom analysis.',
            command: 'openDataPanel',
            delay: 5000
        },
        {
            message: 'You can import rainfall data, historical event records, or your own proprietary data for integrated analysis.',
            command: null,
            delay: 4000
        },
        {
            message: 'The system supports various file formats including CSV and GeoJSON, making it compatible with most standard data sources.',
            command: null,
            delay: 3000
        },
        {
            message: 'When new data is uploaded, all visualizations will automatically update to reflect the latest information.',
            command: null,
            delay: 3000
        },
        
        // PART 7: ESG INTEGRATION (45 seconds)
        {
            message: '**Part 7: ESG Integration** - Finally, let\'s explore how this data connects to ESG reporting and risk assessment.',
            command: 'openESGPanel',
            delay: 5000
        },
        {
            message: 'The ESG panel provides frameworks for translating flood and climate data into standardized ESG metrics and disclosures.',
            command: null,
            delay: 4000
        },
        {
            message: 'You can generate reports that align with TCFD recommendations, showing how physical climate risks impact financial performance.',
            command: null,
            delay: 4000
        },
        {
            message: 'The system can also help identify vulnerable assets and operations, supporting resilience planning and adaptation strategies.',
            command: null,
            delay: 4000
        },
        
        // PART 8: CONCLUSION (25 seconds)
        {
            message: '**Conclusion** - This concludes our comprehensive tour of the Australian Flood Risk & ESG Dashboard.',
            command: 'closePanels',
            delay: 3000
        },
        {
            message: 'Remember that you can interact with all features using natural language through this assistant. Just ask for what you need, like "show rainfall data" or "filter to flood events."',
            command: null,
            delay: 5000
        },
        {
            message: 'Would you like me to demonstrate any specific aspect in more detail, or would you prefer to explore the dashboard yourself?',
            command: null,
            delay: 0
        }
    ];
    
    // Execute the demo steps with delays
    let currentStep = 0;
    
    function executeNextStep() {
        if (currentStep >= demoSteps.length) return;
        
        const step = demoSteps[currentStep];
        addChatbotMessage('Assistant', step.message);
        
        if (step.command) {
            if (typeof step.command === 'function') {
                step.command();
            } else {
                executeChatbotCommand(step.command);
            }
        }
        
        currentStep++;
        
        if (currentStep < demoSteps.length) {
            setTimeout(executeNextStep, step.delay);
        }
    }
    
    // Start the demo sequence
    executeNextStep();
}