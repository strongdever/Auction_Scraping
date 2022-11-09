const {createServer} = require('http');
const puppeteer = require('puppeteer')

const hostname = '127.0.0.1';
const port = 3000;
var popuppage = null;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

const extractNumber = (str) => {
  let num = str.match(/\d/g);
  num = num.join("");
  return num
}

////////////////////========scrapping=========///////////////////////
let bidclosed = false
const getfinalbid = async () => {
  try{
    await popuppage.waitForSelector('#js-asking-bid')
    let bidstatus = await popuppage.evaluate(() => {
      return document.querySelector('#js-asking-bid').innerText
    })
    if(bidstatus == 'BIDDING CLOSED'){
      await popuppage.waitForSelector('#jsEventStartedContainer > div > div.bid-area-container.theme--dark > div.js-BidActions > div > div > div.high-bid > span.high-bid__amount')
      let finalbid = await popuppage.evaluate(() => {
        return document.querySelector('#jsEventStartedContainer > div > div.bid-area-container.theme--dark > div.js-BidActions > div > div > div.high-bid > span.high-bid__amount').innerText
      })
      if(!bidclosed){
        console.log(extractNumber(finalbid));
        bidclosed = true;
      }
    }
    else{
      bidclosed = false;
    }
  }
  catch(e){
    return
  }
}

(async () => {
  const puppeteer = require('puppeteer');         // puppeteer
  const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: false
  })
  page = await browser.newPage()
  await page.setDefaultNavigationTimeout(0);
  await page.goto('https://www.iaai.com/')
  await page.bringToFront();

  browser.on('targetcreated', async (target) => { //This block intercepts all new events
    if (target.type() === 'page') {     // if it tab/page      
      popuppage = await target.page();      // declare it
      await popuppage.setDefaultNavigationTimeout(0);
      const url = popuppage.url();  
      popuppage.goto(url)
      await popuppage.bringToFront();
      // await popuppage.waitForNavigation({
      //   waitUntil: 'load',
      // });
      setInterval(getfinalbid, 1000);
      // if (url.search('site.com') == -1){     // if url is not like site.com (pop-up window whith ads to anower site)
      //   await popuppage.close();           // close this page
      // }
    }
  });
    
                        // close browser
})();
