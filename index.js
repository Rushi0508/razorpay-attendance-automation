const puppeteer = require('puppeteer');
require('dotenv').config();

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function humanLikeType(page, selector, text) {
    for (let i = 0; i < text.length; i++) {
        const randomDelay = Math.floor(Math.random() * 100) + 200;
        await page.type(selector, text[i], { delay: randomDelay });
    }
}

async function humanLikeMouseMove(page, selector) {
    const element = await page.$(selector);
    const box = await element.boundingBox();

    const randomX = Math.floor(Math.random() * 10);
    const randomY = Math.floor(Math.random() * 10);

    await page.mouse.move(box.x + randomX, box.y + randomY, { steps: 10 });
}

async function fillAttendance(email, password) {
    const browser = await puppeteer.launch(
        {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    );
    const page = await browser.newPage();

    try {
        await page.goto(`https://payroll.razorpay.com/login?redirect=%2Fattendance`);

        await page.waitForSelector('input[id="email"]');
        console.log("Page loaded successfully");
        await humanLikeMouseMove(page, 'input[id="email"]');

        await humanLikeType(page, 'input[id="email"]', email);

        await page.waitForSelector('input[id="password"]');
        await humanLikeMouseMove(page, 'input[id="password"]');

        await humanLikeType(page, 'input[id="password"]', password);
        console.log("Typing done");
        await sleep(1000);

        await humanLikeMouseMove(page, 'button[id="loginButton"]');
        await page.click('button[id="loginButton"]');
        console.log("Clicked login button");
        await page.waitForNavigation();
        console.log("Logged in successfully");

        await page.click('button[value="mark-attendance-checkin"]');
        console.log("Clicked mark attendance");
        await sleep(2000);
    } finally {
        await browser.close();
    }
}

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

fillAttendance(email, password);
