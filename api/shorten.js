// api/shorten.js
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { longUrl, customCode } = await req.body;
    
    if (!longUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Add https if missing
    const finalUrl = longUrl.startsWith('http') ? longUrl : `https://${longUrl}`;
    
    // Generate short code
    function generateCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    }
    
    let shortCode = customCode || generateCode();
    
    // Firebase URL (gunakan environment variable untuk auth)
    const FIREBASE_URL = 'https://unews-4db42-default-rtdb.firebaseio.com/shorturls';
    
    // Check if code exists
    const checkRes = await fetch(`${FIREBASE_URL}/${shortCode}.json`);
    const existing = await checkRes.json();
    
    if (existing && customCode) {
      return res.status(400).json({ error: 'Custom code already exists' });
    }
    
    // If random code exists, generate new one
    if (existing && !customCode) {
      shortCode = generateCode();
    }
    
    // Save to Firebase
    const saveRes = await fetch(`${FIREBASE_URL}/${shortCode}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        longUrl: finalUrl,
        shortCode,
        createdAt: Date.now(),
        clicks: 0
      })
    });
    
    if (!saveRes.ok) {
      throw new Error('Failed to save to database');
    }
    
    res.json({
      success: true,
      shortUrl: `https://pgxl.web.id/${shortCode}`,
      shortCode
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
