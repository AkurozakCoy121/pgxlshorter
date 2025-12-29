// api/history.js
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const FIREBASE_URL = 'https://unews-4db42-default-rtdb.firebaseio.com/shorturls.json';
    
    const response = await fetch(FIREBASE_URL);
    
    if (!response.ok) {
      throw new Error('Failed to fetch from database');
    }
    
    const data = await response.json();
    
    if (!data) {
      return res.json([]);
    }
    
    // Convert object to array and take last 10
    const urls = Object.keys(data)
      .map(key => ({
        id: key,
        ...data[key]
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10);
    
    res.json(urls);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}
