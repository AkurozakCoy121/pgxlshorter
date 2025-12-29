// api/shorten.js
import fetch from 'node-fetch';

const FIREBASE_URL = 'https://unews-4db42-default-rtdb.firebaseio.com';
const FIREBASE_SECRET = process.env.FIREBASE_SECRET; // Simpan di Vercel Environment Variables

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { longUrl, customCode } = req.body;
        
        // Validasi
        if (!longUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }
        
        // Generate short code
        const shortCode = customCode || generateShortCode();
        
        // Save to Firebase with auth token
        const response = await fetch(`${FIREBASE_URL}/shorturls/${shortCode}.json?auth=${FIREBASE_SECRET}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                longUrl,
                shortCode,
                createdAt: Date.now(),
                clicks: 0
            })
        });
        
        if (response.ok) {
            res.json({
                success: true,
                shortUrl: `https://pgxl.web.id/${shortCode}`,
                shortCode
            });
        } else {
            res.status(500).json({ error: 'Failed to save to database' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

function generateShortCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
