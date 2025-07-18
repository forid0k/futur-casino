// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

let browser;

app.get('/api/latest', async (req, res) => {
  try {
    if (!browser) browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://crickexnow.com/bd/bn/casino?vendor=evo', { waitUntil: 'networkidle2' });

    // 🎯 এখানে সিলেক্টর আপডেট করুন
    const data = await page.evaluate(() => {
      // উদাহরণ: <div class="evo-number active">5</div>
      const el = document.querySelector('.evo-number.active');
      return el ? el.textContent.trim() : 'Unknown';
    });

    await page.close();
    res.json({ result: data, timestamp: Date.now() });

  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Failed to fetch result.' });
  }
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
