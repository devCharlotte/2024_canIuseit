const express = require('express');
const bodyParser = require('body-parser');
const pdf = require('pdfkit');
const { google } = require('googleapis');
const { Product } = require('./models'); // Sequelize 모델 불러오기
require('dotenv').config();

// Express 앱 생성
const app = express();
app.use(bodyParser.json());

// 제품 목록 조회 API
app.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 내부 오류가 발생했습니다.\n 다시 시도해주세요.');
  }
});

// 라벨 출력 API -> pdf 형식의 docu 생성되도록 
app.post('/labels', async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('물건이 존재하지 않습니다');
    }

    // PDF 생성
    const doc = new pdf();
    doc.fontSize(12); // 프린트할 라벨지가 작을 것 같아서 폰트 사이즈도 작게...ㅎㅎ
    doc.text(`제품명: ${product.name}`);
    doc.text(`제조일자: ${product.manufactureDate}`);
    doc.text(`소비기한: ${product.expirationDate}`);

    // PDF 프린트 아웃
    res.setHeader('Content-disposition', 'attachment; filename=label.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 내부 오류가 발생했습니다.\n 다시 시도해주세요.');
  }
});

// Google Calendar API 설정
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// 캘린더 등록 API
app.post('/calendar', async (req, res) => {
  const { productId } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('물건이 존재하지 않습니다');
    }

    const event = {
      summary: `소비기한: ${product.name}`,
      description: `제조일자: ${product.manufactureDate}, 소비기한: ${product.expirationDate}`,
      start: {
        date: product.expirationDate,
      },
      end: {
        date: product.expirationDate,
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 내부 오류가 발생했습니다.\n 다시 시도해주세요.');
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});