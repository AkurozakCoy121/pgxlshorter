// File ini di Vercel Functions
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { user, project, file = 'index.html' } = req.query;
  
  // Ambil file dari Firebase Storage
  const fileUrl = `https://firebasestorage.googleapis.com/v0/b/YOUR_PROJECT.appspot.com/o/projects%2F${project}%2F${file}`;
  
  try {
    const response = await fetch(fileUrl);
    const contentType = response.headers.get('content-type') || 'text/html';
    
    // Add PGXL ads to HTML files
    if (contentType.includes('html')) {
      let html = await response.text();
      html = html.replace('</body>', `
        <div style="background:#f8f9fa; border:2px solid #667eea; padding:15px; margin:20px 0; text-align:center; border-radius:10px;">
          <p>🚀 <strong>Hosted on PGXL.WEB.ID</strong></p>
          <p>Free static hosting with custom subdomain</p>
          <a href="https://pgxl.web.id" style="color:#667eea;">Create your own free website</a>
        </div>
      </body>`);
      
      res.setHeader('Content-Type', contentType);
      res.send(html);
    } else {
      res.setHeader('Content-Type', contentType);
      response.body.pipe(res);
    }
  } catch (error) {
    res.status(404).send('File not found');
  }
};
