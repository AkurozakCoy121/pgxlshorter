// api/redirect.js
export default async function handler(req, res) {
  const { short } = req.query;
  
  if (!short) {
    return res.redirect(302, '/');
  }
  
  try {
    const FIREBASE_URL = `https://unews-4db42-default-rtdb.firebaseio.com/shorturls/${short}.json`;
    
    const response = await fetch(FIREBASE_URL);
    const data = await response.json();
    
    if (data && data.longUrl) {
      // Update click count
      await fetch(FIREBASE_URL, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clicks: (data.clicks || 0) + 1,
          lastAccessed: new Date().toISOString()
        })
      });
      
      return res.redirect(302, data.longUrl);
    } else {
      // URL not found
      return res.redirect(302, '/');
    }
  } catch (error) {
    console.error('Redirect error:', error);
    return res.redirect(302, '/');
  }
}
