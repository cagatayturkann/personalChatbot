const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// MongoDB bağlantısı
const connectDB = require('./config/db');

// Routes
const routes = require('./routes');

// MongoDB'ye bağlan
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Geliştirme ortamı kontrolü
const isDevelopment = process.env.NODE_ENV !== 'production';

// İzin verilen domainler
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',  // VS Code Live Server
  'http://127.0.0.1:5500',  // VS Code Live Server
  'https://cagatayturkan.com',
  'https://www.cagatayturkan.com',
  'https://cagatayturkann.github.io',
  'https://personal-chatbot-nine.vercel.app'
];

// CORS ayarları
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Her istekte CORS başlıklarını ekle
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // OPTIONS isteklerine hemen yanıt ver
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API is working properly',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use(routes);

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Widget kodu oluşturan yardımcı fonksiyon
function generateWidgetCode(baseUrl) {
  return `
(function() {
  // Create iframe element
  var iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.bottom = '0';
  iframe.style.right = '0';
  iframe.style.width = '420px';
  iframe.style.height = '750px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.display = 'none';
  iframe.allow = 'microphone';
  iframe.src = '${baseUrl}';
  
  // Create toggle button
  var toggleBtn = document.createElement('button');
  toggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '20px';
  toggleBtn.style.right = '20px';
  toggleBtn.style.width = '60px';
  toggleBtn.style.height = '60px';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.backgroundColor = '#1A2634';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.border = 'none';
  toggleBtn.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.zIndex = '10000';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.transition = 'transform 0.3s ease';
  
  // Add hover effect
  toggleBtn.onmouseover = function() {
    this.style.transform = 'scale(1.1)';
  };
  toggleBtn.onmouseout = function() {
    this.style.transform = 'scale(1)';
  };
  
  // Toggle iframe visibility
  var isVisible = false;
  toggleBtn.onclick = function() {
    isVisible = !isVisible;
    iframe.style.display = isVisible ? 'block' : 'none';
  };
  
  // Append elements to body when DOM is loaded
  document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(iframe);
    document.body.appendChild(toggleBtn);
  });
  
  // If DOM is already loaded, append elements immediately
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    document.body.appendChild(iframe);
    document.body.appendChild(toggleBtn);
  }
})();
`;
}

// Serve the iframe embed code
app.get('/iframe', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const widgetCode = generateWidgetCode(baseUrl);
  
  const iframeCode = `
<!-- ChaCha[Çaça] Chatbot Widget -->
<div style="background-color: #f5f5f5; border-radius: 8px; padding: 20px; margin: 20px 0; font-family: Arial, sans-serif;">
  <h3 style="margin-top: 0; color: #333;">ChaCha[Çaça] Chatbot Embed Kodu</h3>
  <p style="color: #666;">Aşağıdaki kodu web sitenize ekleyerek ChaCha[Çaça] chatbot'u entegre edebilirsiniz:</p>
  <pre style="background-color: #fff; padding: 15px; border-radius: 4px; overflow-x: auto; border: 1px solid #ddd;"><code>&lt;!-- ChaCha[Çaça] Chatbot Widget --&gt;
&lt;script&gt;${widgetCode}&lt;/script&gt;
&lt;!-- End ChaCha[Çaça] Chatbot Widget --&gt;</code></pre>
  <p style="color: #666; margin-top: 15px;">Bu kodu web sitenizin &lt;body&gt; etiketinin içine, tercihen kapanış etiketinden hemen önce yerleştirin.</p>
  <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
    <h4 style="margin-top: 0; color: #333;">Özelleştirme Seçenekleri</h4>
    <ul style="color: #666; padding-left: 20px;">
      <li>Butonun konumunu değiştirmek için <code>toggleBtn.style.bottom</code> ve <code>toggleBtn.style.right</code> değerlerini ayarlayabilirsiniz.</li>
      <li>Butonun rengini değiştirmek için <code>toggleBtn.style.backgroundColor</code> değerini değiştirebilirsiniz.</li>
      <li>Chatbot penceresinin boyutunu değiştirmek için <code>iframe.style.width</code> ve <code>iframe.style.height</code> değerlerini ayarlayabilirsiniz.</li>
    </ul>
  </div>
  <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
    <h4 style="margin-top: 0; color: #333;">Entegrasyon Adımları</h4>
    <ol style="color: #666; padding-left: 20px;">
      <li>Yukarıdaki kodu kopyalayın.</li>
      <li>Web sitenizin HTML kodunda &lt;body&gt; etiketinin kapanışından hemen önce yapıştırın.</li>
      <li>Eğer WordPress kullanıyorsanız, bir "HTML" veya "Custom HTML" widget'ı ekleyip kodu buraya yapıştırabilirsiniz.</li>
      <li>Eğer bir tema veya şablon kullanıyorsanız, footer.php dosyasını düzenleyerek &lt;/body&gt; etiketinden önce kodu ekleyebilirsiniz.</li>
      <li>Değişiklikleri kaydedin ve web sitenizi yenileyin.</li>
    </ol>
  </div>
  <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd;">
    <h4 style="margin-top: 0; color: #333;">Test Etme</h4>
    <p style="color: #666;">Aşağıdaki butona tıklayarak entegrasyonu test edebilirsiniz:</p>
    <button onclick="window.open('${baseUrl}/entegrasyon-test', '_blank')" style="background-color: #2563EB; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; font-weight: 500;">Test Sayfasını Aç</button>
  </div>
</div>
  `;
  
  res.send(iframeCode);
});

// Serve a simple integration test page
app.get('/entegrasyon-test', (req, res) => {
  const host = req.get('host');
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const widgetCode = generateWidgetCode(baseUrl);
  
  const testPage = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ChaCha[Çaça] Entegrasyon Testi</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    .container {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 30px;
    }
    .success {
      color: #2563EB;
      font-weight: bold;
    }
    .steps {
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
    }
    .steps h3 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <h1>ChaCha[Çaça] Entegrasyon Testi</h1>
  
  <div class="container">
    <h2>Test Sayfası</h2>
    <p>Bu sayfa, ChaCha[Çaça] chatbot'un web sitenize nasıl entegre edileceğini göstermek için oluşturulmuştur.</p>
    <p class="success">✓ Chatbot başarıyla yüklendi! Sağ alt köşedeki sohbet ikonuna tıklayarak chatbot'u açabilirsiniz.</p>
    
    <div class="steps">
      <h3>Kendi Sitenize Entegre Etmek İçin:</h3>
      <ol>
        <li><a href="${baseUrl}/iframe" target="_blank">Entegrasyon sayfasına</a> gidin.</li>
        <li>Verilen kodu kopyalayın.</li>
        <li>Web sitenizin HTML kodunda &lt;body&gt; etiketinin kapanışından hemen önce yapıştırın.</li>
        <li>Değişiklikleri kaydedin ve web sitenizi yenileyin.</li>
      </ol>
    </div>
  </div>
</body>

<!-- ChaCha[Çaça] Chatbot Widget -->
<script>${widgetCode}</script>
<!-- End ChaCha[Çaça] Chatbot Widget -->
</html>
  `;
  
  res.send(testPage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
