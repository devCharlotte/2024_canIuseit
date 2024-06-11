const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Category = require('./Category');

// Product 모델 정의
const Product = sequelize.define('Product', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // 제품 이름은 필수 입력 항목
    },
    manufactureDate: {
        type: DataTypes.DATE,
        allowNull: false, // 제조일자는 필수 입력 항목
    },
    shelfLifeDays: {
        type: DataTypes.INTEGER,
        allowNull: true, // 보관 기한은 선택 입력 항목
    },
    expirationDate: {
        type: DataTypes.DATE,
        allowNull: true, // 소비기한은 선택 입력 항목
    },
    openedDate: {
        type: DataTypes.DATE,
        allowNull: false, // 개봉일자는 필수 입력 항목
    },
    categoryId: {
        type: DataTypes.INTEGER,
        references: {
            model: Category, // Category 모델을 참조
            key: 'id',
        },
        allowNull: false, // 카테고리 ID는 필수 입력 항목
    },
}, {
    tableName: 'products', // 테이블 이름 명시적 지정
    timestamps: false, // 타임스탬프 비활성화
});

// Category와 Product 간의 관계 설정
Product.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = Product;
