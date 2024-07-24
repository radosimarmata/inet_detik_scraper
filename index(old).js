const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};

const getDateFromInput = async () => {
  let dateInput;
  while (true) {
    dateInput = await askQuestion('Masukkan tanggal (format: YYYY-MM-DD): ');
    const inputDate = moment(dateInput, 'YYYY-MM-DD', true);
    const today = moment().startOf('day');
    if (inputDate.isValid() && inputDate.isSameOrBefore(today)) {
      break;
    }
    console.log('Tanggal tidak valid atau melebihi hari ini. Silakan coba lagi.');
  }
  return dateInput;
};

(async () => {
  let option;
  while (true) {
    option = await askQuestion('Pilih opsi (1 untuk hari ini, 2 untuk manual): ');
    if (option === '1' || option === '2') {
      break;
    }
    console.log('Opsi tidak valid. Silakan pilih 1 atau 2.');
  }

  let dateInput;
  if (option === '2') {
    dateInput = await getDateFromInput();
  }

  rl.close();

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  const url = 'https://inet.detik.com/indeks/1';
  await page.goto(url);

  await page.waitForSelector('article');

  const articles = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('article.list-content__item');

    items.forEach((item) => {
      const titleElement = item.querySelector('h3.media__title a');
      const imageElement = item.querySelector('span.ratiobox');
      const dateElement = item.querySelector('div.media__date span');

      const title = titleElement ? titleElement.innerText.trim() : 'No title';
      const url = titleElement ? titleElement.href : 'No URL';

      let imageUrl = 'No image';
      if (imageElement) {
        const backgroundImage = imageElement.style.backgroundImage;
        const matches = backgroundImage.match(/url\(["']?([^"']*)["']?\)/g);
        if (matches && matches.length > 0) {
          imageUrl = matches[0].replace(/url\(["']?([^"']*)["']?\)/, '$1');
        }
      }
      
      const date = dateElement ? dateElement.getAttribute('title') : 'No date';

      results.push({ title, url, imageUrl, date });
    });

    return results;
  });

  // Buat direktori results jika belum ada
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  // Mengelompokkan artikel berdasarkan tanggal
  const articlesByDate = articles.reduce((acc, article) => {
    const dateMatch = article.date.match(/(\d{2} \w{3} \d{4} \d{2}:\d{2})/);
    const dateStr = dateMatch ? dateMatch[0] : 'invalid_date';
    
    if (dateStr === 'invalid_date') return acc;

    const formattedDate = moment(dateStr, 'DD MMM YYYY HH:mm').isValid()
      ? moment(dateStr, 'DD MMM YYYY HH:mm').format('YYYY_MM_DD')
      : 'invalid_date';

    if (!acc[formattedDate]) {
      acc[formattedDate] = [];
    }

    acc[formattedDate].push(article);
    return acc;
  }, {});

  // Simpan data berdasarkan pilihan
  if (option === '1') {
    const todayDate = moment().format('YYYY_MM_DD');
    const articlesToday = articlesByDate[todayDate] || [];
    const filePath = path.join(resultsDir, `${todayDate}.json`);
    const content = JSON.stringify(articlesToday, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
  } else if (option === '2') {
    const formattedDate = moment(dateInput).format('YYYY_MM_DD');
    const articlesByInputDate = articlesByDate[formattedDate] || [];
    const filePath = path.join(resultsDir, `${formattedDate}.json`);
    const content = JSON.stringify(articlesByInputDate, null, 2);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  console.log('Data berhasil disimpan.');
  await browser.close();
})();
