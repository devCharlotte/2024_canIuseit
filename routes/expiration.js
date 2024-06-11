const express = require('express');
const router = express.Router();
const expirationController = require('../controllers/expirationController');

// 제품 추가 라우트
// POST /products
// 요청 본문에 제품 정보를 담아 요청
router.post('/products', expirationController.addProduct);

// 제품 조회 라우트
// GET /products
// 모든 제품 정보를 반환
router.get('/products', expirationController.getProducts);

module.exports = router;
