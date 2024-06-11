const sequelize = require('../config/database');
const Category = require('./Category');
const User = require('./User');
const Product = require('./Product');

const initDb = async () => {
  await sequelize.sync({ force: true });
  console.log('Database synchronized');

  // 카테고리별 소비기한 기준 데이터 초기화 // 이거 우리 카테고리 번호로 해야하는거잖아..!! -준희
  await Category.bulkCreate([
    { name: 'Dairy', shelfLifeDays: 7 },
    { name: 'Meat', shelfLifeDays: 5 },
    { name: 'Vegetables', shelfLifeDays: 10 },
      
  ]);
};

module.exports = { sequelize, initDb, Category, User, Product };
