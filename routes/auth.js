const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Google 로그인 라우트
router.get('/google', authController.googleLogin);

router.get('/google/callback',
  authController.googleCallback,
  authController.googleCallbackSuccess
);

// Naver 로그인 라우트
router.get('/naver', authController.naverLogin);

router.get('/naver/callback',
  authController.naverCallback,
  authController.naverCallbackSuccess
);

module.exports = router;