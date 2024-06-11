const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Category 모델 정의
const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // 카테고리 이름은 고유해야 함
  },
  shelfLifeDays: {
    type: DataTypes.INTEGER,
    allowNull: false, // 보관 기한은 필수 입력 항목
  },
}, {
  tableName: 'categories', // 테이블 이름 명시적 지정
  timestamps: false, // 타임스탬프 비활성화
});

module.exports = Category;
