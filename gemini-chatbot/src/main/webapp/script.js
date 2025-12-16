document.addEventListener('DOMContentLoaded', function() {
    console.log("System: Script Loaded and DOM is ready.");

    // --- 1. Select Elements safely ---
    const chatBox = document.getElementById('chatBox');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    
    // Settings Elements
    const settingsBtn = document.getElementById('openSettingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.getElementById('closeSettingsBtn');
    const saveSettings = document.getElementById('saveSettings');
    const systemInput = document.getElementById('systemInstruction'); // The text area in modal

    // --- 2. DEBUG: Check if buttons exist ---
    if (!sendBtn) {
        console.error("CRITICAL ERROR: 'sendBtn' not found. Check HTML IDs.");
        return;
    }

    // --- 3. Attach Click Event ---
    sendBtn.onclick = function() {
        sendMessage();
    };

    // Allow "Enter" key to send (Shift+Enter for new line)
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // --- 4. Main Send Logic ---
    // --- 4. Main Send Logic ---
    async function sendMessage() {
        const message = userInput.value.trim();
        const instruction = systemInput ? systemInput.value.trim() : "";

        if (!message) return;
        
        // 1. Show User Message
        addMessage(message, 'user');
        userInput.value = '';
        userInput.style.height = 'auto'; 

        // 2. Button Loading State (Spinner)
        const originalBtnContent = sendBtn.innerHTML;
        sendBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i>'; 
        sendBtn.disabled = true;

        // 3. ADD LOADING BUBBLE TO CHAT (The new part)
        const loadingId = 'loading-' + Date.now(); // Unique ID to find it later
        addLoadingBubble(loadingId); 
        
        try {
            console.log("System: Sending payload...");
            
            const response = await fetch('chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: message,
                    system_instruction: instruction 
                })
            });
            
            if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
            
            const data = await response.json();
            
            // 4. REMOVE LOADING BUBBLE
            removeLoadingBubble(loadingId);

            if (data.error) {
                addMessage('Error: ' + data.error, 'bot');
            } else {
                addMessage(data.response, 'bot');
            }
            
        } catch (error) {
            console.error("Fetch Error:", error);
            removeLoadingBubble(loadingId); // Ensure we remove it even on error
            addMessage('Error: ' + error.message, 'bot');
        } finally {
            // Restore Button
            sendBtn.innerHTML = originalBtnContent;
            sendBtn.disabled = false;
        }
    }

    // --- 5. UI Helper Function ---
    function addMessage(text, sender) {
        const welcome = document.querySelector('.welcome-screen');
        if (welcome) welcome.style.display = 'none';

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = sender === 'user' 
            ? '<i class="ri-user-line"></i>' 
            : '<i class="ri-robot-2-line"></i>';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        
        // Safe Text Insertion with line breaks
        const textNode = document.createElement('div');
        textNode.innerText = text; // Secure way to set text
        bubbleDiv.innerHTML = textNode.innerHTML.replace(/\n/g, '<br>');

        if (sender === 'user') {
            messageDiv.appendChild(bubbleDiv);
            messageDiv.appendChild(avatarDiv); // User avatar on right
        } else {
            messageDiv.appendChild(avatarDiv); // Bot avatar on left
            messageDiv.appendChild(bubbleDiv);
        }
        
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- 6. Settings Modal Logic ---
    if (settingsBtn) settingsBtn.onclick = () => settingsModal.style.display = 'flex';
    if (closeModal) closeModal.onclick = () => settingsModal.style.display = 'none';
    
    // Save Button just closes modal (we read the value dynamically on send)
    if (saveSettings) {
        saveSettings.onclick = () => {
            const currentInstruction = systemInput.value;
            console.log("Settings Saved: " + currentInstruction);
            settingsModal.style.display = 'none';
            
            // Optional: Show a tiny notification that settings are active
            addMessage("System: Instructions updated. Model is trained with new persona.", 'bot');
        };
    }
    
    // Close modal if clicking outside content
    window.onclick = function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = "none";
        }
    }

    // --- Helper: Add the "Thinking" Bubbles ---
    function addLoadingBubble(id) {
        const chatBox = document.getElementById('chatBox');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot';
        messageDiv.id = id; // Set ID so we can delete it later
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'avatar';
        avatarDiv.innerHTML = '<i class="ri-robot-2-line"></i>';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'bubble';
        // Insert the HTML for the 3 dots
        bubbleDiv.innerHTML = `
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(bubbleDiv);
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // --- Helper: Remove the "Thinking" Bubble ---
    function removeLoadingBubble(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }
});