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
    addChatbotMessage('Assistant', 'Welcome! 👋 I\'m your dashboard assistant. I can help you explore Australian flood risk data for ESG analysis and risk assessment. Try asking me to "show rainfall data", "run a demo", or say "help" for more options.');
    
    // Add custom sales information button
    addChatbotMessage('Assistant', 'I can guide you through specific features based on your interests. What aspects of flood risk assessment or ESG reporting are you most interested in? You can also [action:run sales demo] or [action:ask about pricing].');
    
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
    
    // Store user interest for personalized recommendations
    if (!window.userInterests) window.userInterests = [];
    
    // Capture industry interests
    const industries = ['insurance', 'banking', 'property', 'asset management', 'infrastructure', 'real estate', 'agriculture'];
    industries.forEach(industry => {
        if (lowerMessage.includes(industry) && !window.userInterests.includes(industry)) {
            window.userInterests.push(industry);
            console.log('User interest detected:', industry);
        }
    });
    
    // Capture feature interests
    const features = ['climate', 'esg', 'risk', 'reporting', 'analytics', 'prediction', 'compliance', 'disclosure', 'tcfd'];
    features.forEach(feature => {
        if (lowerMessage.includes(feature) && !window.userInterests.includes(feature)) {
            window.userInterests.push(feature);
            console.log('User interest detected:', feature);
        }
    });
    
    // Simulate thinking
    setTimeout(() => {
        // Sales demo mode
        if (lowerMessage.includes('run sales demo') || lowerMessage.includes('sales demo')) {
            runSalesDemo();
            return;
        }
        
        // Standard demo mode
        if (lowerMessage.includes('demo') || lowerMessage.includes('presentation') || lowerMessage.includes('showcase')) {
            runChatbotDemo();
            return;
        }
        
        // Pricing information
        if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('subscription') || lowerMessage.includes('price')) {
            showPricingInfo();
            return;
        }
        
        // Help commands
        if (lowerMessage === 'help' || lowerMessage.includes('what can you do')) {
            showChatbotHelp();
            return;
        }
        
        // Contact information request
        if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('phone') || lowerMessage.includes('call')) {
            showContactInfo();
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
        
        // Lead capture
        if (lowerMessage.includes('interested') || lowerMessage.includes('more information') || lowerMessage.includes('details') || lowerMessage.includes('follow up')) {
            captureLeadInfo(message);
            return;
        }
        
        // Provide a custom response based on detected interests
        if (window.userInterests && window.userInterests.length > 0) {
            const response = generatePersonalizedResponse(message, window.userInterests);
            if (response) {
                addChatbotMessage('Assistant', response);
                return;
            }
        }
        
        // Fallback response
        addChatbotMessage('Assistant', 'I\'m not sure how to do that yet. Try "help" to see what I can do, or tell me what aspect of flood risk or ESG reporting interests you most.');
    }, 500);
}

// Generate personalized responses based on user interests
function generatePersonalizedResponse(message, interests) {
    const lowerMessage = message.toLowerCase();
    
    // If message asks about their specific industry
    for (const interest of interests) {
        if (lowerMessage.includes(interest)) {
            switch(interest) {
                case 'insurance':
                    return `For insurance professionals, our dashboard provides critical flood risk assessments that can improve underwriting accuracy by up to 30%. Would you like to see our [action:insurance demo] focused on risk modeling?`;
                
                case 'banking':
                    return `Our banking clients leverage this dashboard for TCFD compliance and physical risk assessment in lending portfolios. Would you like to see how our [action:portfolio risk assessment] works?`;
                
                case 'property':
                case 'real estate':
                    return `For property and real estate professionals, we offer location-specific risk scoring that incorporates both historical data and future climate scenarios. Would you like me to [action:show property risk demo]?`;
                
                case 'agriculture':
                    return `Our agricultural users benefit from seasonal flood forecasting and long-term climate trend analysis. I can [action:show agriculture features] if you're interested.`;
                
                case 'esg':
                case 'reporting':
                case 'disclosure':
                case 'tcfd':
                    return `Our ESG reporting tools automate data collection for climate-related disclosures, saving hundreds of hours of manual work. Would you like to see our [action:ESG reporting templates]?`;
                
                case 'prediction':
                case 'analytics':
                    return `Our predictive analytics combine historical flood data with climate models to project future risk scenarios. I can [action:demonstrate predictive features] if you'd like.`;
            }
        }
    }
    
    return null; // No personalized response generated
}

// Show pricing information
function showPricingInfo() {
    const pricingMessage = `
        <strong>Pricing Options:</strong>
        
        We offer flexible subscription plans based on your organization's needs:
        
        <strong>Basic:</strong> $499/month
        • Essential flood risk data
        • Historical event analysis
        • Standard ESG reporting templates
        
        <strong>Professional:</strong> $999/month
        • Advanced risk modeling
        • Custom reporting
        • API access
        • Unlimited users
        
        <strong>Enterprise:</strong> Custom pricing
        • Full data integration
        • Dedicated support
        • Customized dashboards
        • On-premise deployment option
        
        Would you like me to [action:arrange a consultation] to discuss which plan would best suit your needs?
    `;
    
    addChatbotMessage('Assistant', pricingMessage);
}

// Show contact information
function showContactInfo() {
    const contactMessage = `
        <strong>Contact Information:</strong>
        
        Email: sales@floodrisk-dashboard.com
        Phone: +61 2 5550 1234
        
        Or fill out your information below and our team will contact you:
        
        <div class="contact-form">
            <input type="text" id="contact-name" placeholder="Your Name" class="contact-input">
            <input type="email" id="contact-email" placeholder="Your Email" class="contact-input">
            <input type="text" id="contact-company" placeholder="Company" class="contact-input">
            <button onclick="submitContactForm()" class="contact-submit">Submit</button>
        </div>
    `;
    
    addChatbotMessage('Assistant', contactMessage);
}

// Capture lead information
function captureLeadInfo(message) {
    addChatbotMessage('Assistant', `Thank you for your interest! To better assist you, could you please provide:
    
    1. Your name
    2. Company name
    3. Email address
    
    This will help us tailor a demonstration specifically for your needs.`);
    
    // Set a flag to capture the next message as lead info
    window.capturingLeadInfo = true;
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
    addChatbotMessage('Assistant', '🌟 **Starting ESG & Flood Risk Dashboard Demo** 🌟\n\nI\'ll walk you through the key features of this dashboard for ESG analysis and risk assessment.\n\nLoading visualization data... please wait a moment.');
    
    // Load demo data if not already loaded
    loadDemoData();
    
    // Give data time to load before starting demo steps
    setTimeout(() => {
        addChatbotMessage('Assistant', 'Data loaded! Let\'s begin the demonstration.');
        startDemoSequence();
    }, 2000);
}

// Run a sales-focused demo with industry-specific insights
function runSalesDemo() {
    addChatbotMessage('Assistant', '🌟 **Starting Enhanced Sales Demo** 🌟\n\nI\'ll demonstrate how our dashboard delivers business value through actionable flood risk intelligence and ESG reporting capabilities.\n\nLoading visualization data... please wait a moment.');
    
    // Load demo data if not already loaded
    loadDemoData();
    
    // Use user interests if available, otherwise use general approach
    const industryFocus = window.userInterests && window.userInterests.length > 0 ? 
                         window.userInterests[0] : 'general';
    
    // Give data time to load before starting demo steps
    setTimeout(() => {
        addChatbotMessage('Assistant', `Data loaded! Let's begin a customized demonstration focused on ${industryFocus === 'general' ? 'business value' : industryFocus} applications.`);
        startSalesDemoSequence(industryFocus);
    }, 2000);
}

// Start the sales demo sequence with industry focus
function startSalesDemoSequence(industryFocus) {
    // Common introduction steps
    const introSteps = [
        {
            message: '**Business Value Overview** - This dashboard integrates multiple data sources to provide actionable intelligence for risk management, ESG reporting, and strategic planning.',
            command: null,
            delay: 5000
        },
        {
            message: 'Our clients report up to 40% improvement in risk assessment accuracy and 65% time savings in ESG reporting processes.',
            command: null,
            delay: 4000
        }
    ];
    
    // Industry-specific demo steps
    let industrySteps = [];
    
    switch(industryFocus) {
        case 'insurance':
            industrySteps = [
                {
                    message: '**Insurance Industry Focus** - Let\'s look at how insurers use our flood risk data to improve underwriting and pricing models.',
                    command: 'showFloodWarnings',
                    delay: 5000
                },
                {
                    message: 'These active flood warnings are updated in real-time, allowing for immediate risk assessment adjustments for affected portfolios.',
                    command: 'showFloodPolygons',
                    delay: 4000
                },
                {
                    message: 'Let\'s examine historical flood patterns in Queensland, a high-risk region for insurers.',
                    command: function() { 
                        goToNamedLocation('Queensland'); 
                        executeChatbotCommand('filterFloodEvents');
                    },
                    delay: 5000
                },
                {
                    message: 'Insurance clients can overlay their policy data on these maps to identify concentration risks and potential claim hotspots.',
                    command: null,
                    delay: 4000
                },
                {
                    message: 'Our time-based analysis enables modeling of event frequency changes - critical for long-term pricing strategies.',
                    command: 'openTimeSlider',
                    delay: 4000
                },
                {
                    message: 'Watch how flood event patterns have evolved since 1980, informing catastrophe modeling adjustments.',
                    command: 'playTimeSlider',
                    delay: 8000
                }
            ];
            break;
            
        case 'banking':
        case 'finance':
            industrySteps = [
                {
                    message: '**Banking & Finance Focus** - Let\'s look at how financial institutions use our platform for portfolio risk assessment and regulatory compliance.',
                    command: 'openESGPanel',
                    delay: 5000
                },
                {
                    message: 'Our ESG reporting tools align with TCFD requirements, enabling streamlined climate risk disclosure for lending portfolios.',
                    command: null,
                    delay: 4000
                },
                {
                    message: 'Let\'s examine flood risk in major urban centers where property values and lending exposure are highest.',
                    command: function() { 
                        goToNamedLocation('Sydney'); 
                        executeChatbotCommand('showFloodPolygons');
                    },
                    delay: 5000
                },
                {
                    message: 'Banking clients can integrate this data with loan book information to quantify physical climate risk exposure.',
                    command: null,
                    delay: 4000
                },
                {
                    message: 'The platform generates regulatory-ready reports that satisfy stress testing requirements for climate scenarios.',
                    command: 'openFilterPanel',
                    delay: 4000
                }
            ];
            break;
            
        case 'property':
        case 'real estate':
            industrySteps = [
                {
                    message: '**Property & Real Estate Focus** - Let\'s explore how property managers and investors use our platform for asset protection and valuation.',
                    command: 'showFloodPolygons',
                    delay: 5000
                },
                {
                    message: 'These flood risk polygons provide property-level precision for risk assessment and insurance planning.',
                    command: function() { goToNamedLocation('Brisbane'); },
                    delay: 4000
                },
                {
                    message: 'Real estate portfolios can be evaluated against both current and projected flood risk zones, informing acquisition and divestment decisions.',
                    command: null,
                    delay: 5000
                },
                {
                    message: 'Historical rainfall patterns inform infrastructure requirements and adaptation planning for property developments.',
                    command: 'showRainfall',
                    delay: 4000
                },
                {
                    message: 'The ESG reporting capabilities support green building certification and climate resilience documentation.',
                    command: 'openESGPanel',
                    delay: 4000
                }
            ];
            break;
            
        // General business value focus for other industries
        default:
            industrySteps = [
                {
                    message: '**Business Value Focus** - Let\'s explore how organizations across sectors leverage our platform for strategic advantage.',
                    command: 'showFloodWarnings',
                    delay: 5000
                },
                {
                    message: 'Real-time flood warnings enable proactive risk management and business continuity planning.',
                    command: function() { goToNamedLocation('Australia'); },
                    delay: 4000
                },
                {
                    message: 'Historical event analysis informs long-term strategic planning and infrastructure investment decisions.',
                    command: 'showHistoricalEvents',
                    delay: 5000
                },
                {
                    message: 'Time-based visualization reveals changing risk patterns that impact operational planning.',
                    command: 'openTimeSlider',
                    delay: 4000
                },
                {
                    message: 'Watch how extreme weather patterns have evolved over decades - a crucial input for future scenario planning.',
                    command: 'playTimeSlider',
                    delay: 8000
                },
                {
                    message: 'The ESG reporting framework translates physical risk data into standardized disclosures for stakeholders.',
                    command: 'openESGPanel',
                    delay: 5000
                }
            ];
    }
    
    // Closing steps with call to action
    const closingSteps = [
        {
            message: '**ROI Assessment** - Our clients typically achieve:',
            command: 'closePanels',
            delay: 3000
        },
        {
            message: '• 30-40% reduction in climate risk assessment time\n• 65% faster ESG reporting process\n• Up to 25% improvement in risk mitigation planning',
            command: null,
            delay: 5000
        },
        {
            message: '**Implementation** - Our platform can be deployed in as little as 2 weeks, with seamless data integration and user training included.',
            command: null,
            delay: 4000
        },
        {
            message: 'Would you like to discuss how this platform could be customized for your specific needs? I can [action:arrange a consultation] or [action:provide pricing information].',
            command: null,
            delay: 0
        }
    ];
    
    // Combine all demo steps
    const demoSteps = [...introSteps, ...industrySteps, ...closingSteps];
    
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