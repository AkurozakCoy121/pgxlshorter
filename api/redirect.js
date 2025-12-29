// api/redirect.js
const firebaseConfig = {
  apiKey: "AIzaSyAP7lzXcSwmkOk88rXIx77j8s4gsfUs6k0",
  authDomain: "unews-4db42.firebaseapp.com",
  databaseURL: "https://unews-4db42-default-rtdb.firebaseio.com",
  projectId: "unews-4db42",
  storageBucket: "unews-4db42.firebasestorage.app",
  messagingSenderId: "382914552995",
  appId: "1:382914552995:web:ca6f2c0f6a250c39fc4b16",
  measurementId: "G-38CHL8F98F"
};

// Initialize Firebase Admin (simplified version)
async function getLongUrl(shortCode) {
    const response = await fetch(`https://unews-4db42-default-rtdb.firebaseio.com/urls/${shortCode}.json`);
    const data = await response.json();
    return data?.longUrl || null;
}

export default async function handler(req, res) {
    const { short } = req.query;
    
    if (!short) {
        return res.redirect(302, 'https://pgxl.web.id');
    }
    
    try {
        const longUrl = await getLongUrl(short);
        
        if (longUrl) {
            // Increment click counter
            await fetch(`https://unews-4db42-default-rtdb.firebaseio.com/urls/${short}.json`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    clicks: firebase.database.ServerValue.increment(1),
                    lastAccessed: Date.now() 
                })
            });
            
            return res.redirect(302, longUrl);
        } else {
            // URL not found, redirect to home
            return res.redirect(302, 'https://pgxl.web.id');
        }
    } catch (error) {
        console.error('Redirect error:', error);
        return res.redirect(302, 'https://pgxl.web.id');
    }
}
