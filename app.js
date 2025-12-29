// app.js
const SHORT_CODE_LENGTH = 6;

// Generate random short code
function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < SHORT_CODE_LENGTH; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Shorten URL
async function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value.trim();
    let customCode = document.getElementById('customCode').value.trim();
    
    if (!longUrl) {
        alert('Please enter a URL');
        return;
    }
    
    // Add https if missing
    let finalUrl = longUrl;
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
        finalUrl = 'https://' + finalUrl;
    }
    
    // Generate or use custom code
    let shortCode = customCode || generateShortCode();
    
    // Check if code exists
    const checkRef = database.ref('urls/' + shortCode);
    const snapshot = await checkRef.once('value');
    
    if (snapshot.exists() && !customCode) {
        // Regenerate if random code exists
        shortCode = generateShortCode();
    } else if (snapshot.exists() && customCode) {
        alert('Custom code already exists! Try another one.');
        return;
    }
    
    // Save to Firebase
    await database.ref('urls/' + shortCode).set({
        longUrl: finalUrl,
        shortCode: shortCode,
        createdAt: Date.now(),
        clicks: 0
    });
    
    // Show result
    const shortUrl = `https://pgxl.web.id/${shortCode}`;
    document.getElementById('shortUrl').textContent = shortUrl;
    document.getElementById('result').style.display = 'block';
    
    // Generate QR Code
    QRCode.toCanvas(document.getElementById('qrCanvas'), shortUrl, {
        width: 200,
        height: 200
    }, function(error) {
        if (error) console.error(error);
    });
    
    // Load history
    loadHistory();
}

// Copy to clipboard
function copyToClipboard() {
    const url = document.getElementById('shortUrl').textContent;
    navigator.clipboard.writeText(url).then(() => {
        alert('Copied to clipboard!');
    });
}

// Open link
function openLink() {
    const url = document.getElementById('shortUrl').textContent;
    window.open(url, '_blank');
}

// Load history
async function loadHistory() {
    const historyRef = database.ref('urls').orderByChild('createdAt').limitToLast(10);
    const snapshot = await historyRef.once('value');
    
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    const urls = [];
    snapshot.forEach((childSnapshot) => {
        urls.push(childSnapshot.val());
    });
    
    // Sort by newest first
    urls.sort((a, b) => b.createdAt - a.createdAt);
    
    urls.forEach(url => {
        const shortUrl = `https://pgxl.web.id/${url.shortCode}`;
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div>
                <div class="history-short">${url.shortCode}</div>
                <div style="font-size: 12px; color: #666;">${new Date(url.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
                <button class="copy-btn" onclick="copyHistoryUrl('${shortUrl}')">Copy</button>
            </div>
        `;
        historyList.appendChild(div);
    });
}

// Copy from history
function copyHistoryUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Copied: ' + url);
    });
}

// Initialize
window.onload = function() {
    loadHistory();
};
