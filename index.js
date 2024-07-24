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

const formatDateForQuery = (dateInput) => {
  const date = moment(dateInput);
  if (!date.isValid()) {
    throw new Error('Invalid date');
  }
  return `?date=${date.format('MM%2FDD%2FYYYY')}`;
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
  if (option === '1') {
    dateInput = moment().format('YYYY-MM-DD');
  }
  if (option === '2') {
    dateInput = await getDateFromInput();
  }

  rl.close();

  console.time('Total Duration');
  await scrapeData(dateInput);
  console.timeEnd('Total Duration');

})();

const scrapeData = async (dateInput) => {
  const dateParam = formatDateForQuery(dateInput);
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  let pageNumber = 1;
  let lastPagination = 1;
  const url = 'https://inet.detik.com/indeks/';

  await page.goto(`${url}${pageNumber}${dateParam}`);

  // Tunggu elemen pagination
  await page.waitForSelector('.pagination');

  // Ambil data pagination
  lastPagination = await page.evaluate(() => {
    const paginationItems = [];
    const paginationElements = document.querySelectorAll('.pagination__item');
    paginationElements.forEach((element) => {
      const text = element.innerText.trim();
      if (!isNaN(text) && text !== '') {
        paginationItems.push(text);
      }
    });
    // Ambil angka terakhir dari pagination
    return paginationItems.length > 0 ? paginationItems[paginationItems.length - 1] : null;
  });

  console.log('Jumlah Pagination:', lastPagination);

  const allArticles = [];

  for(pageNumber=1; pageNumber<=lastPagination; pageNumber++){
    const currentUrl = `${url}${pageNumber}${dateParam}`;
    console.log(`Scraping dari URL: ${currentUrl}`);
    console.time(`Page ${pageNumber} Load Time`);
    await page.goto(currentUrl);
    console.timeEnd(`Page ${pageNumber} Load Time`);

    // Tunggu elemen artikel
    await page.waitForSelector('article');

    // Ambil data artikel
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
    allArticles.push(...articles);
  }

  // Buat direktori results
  const resultsDir = path.join(__dirname, 'results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  // Menyimpan artikel file JSON
  const allArticlesPath = path.join(resultsDir, `${moment(dateInput).format('YYYY_MM_DD')}.json`);
  fs.writeFileSync(allArticlesPath, JSON.stringify(allArticles, null, 2), 'utf8');

  await browser.close();
};