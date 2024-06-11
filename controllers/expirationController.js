// 카테고리 번호와 일치하는 기준 정보를 데이터베이스에서 가져오거나
// 사용자가 기준 정보를 직접 입력하면
// 그 기준 값을 바탕으로 출력

/* 예상 예시 데이터 - 준희
{
  "name": "Milk",
  "manufactureDate": "2023-06-01",
  "shelfLifeDays": 10,
  "category": 1,  // 드롭다운에서 사용자가 선택한 카테고리를 번호로 처리
  "openedDate": "2023-06-05"
}

*/
// models에서 product, category 모델 가져오기
// db의 categories, products 테이블에 해당 
const { Category, Product } = require('../models/initDb');

// 소비기한 계산 함수
// 개봉 날짜와 소비기간 매개변수로 받아서 더한 값을 소비기한으로 출력하기
const calculateExpiration = (date, shelfLifeDays) => {
    const expirationDate = new Date(date);
    expirationDate.setDate(expirationDate.getDate() + shelfLifeDays);
    return expirationDate;
};

// 새 제품 추가 - 요청과 응답을 매개변수로 받는 비동기 함수
exports.addProduct = async (req, res) => {
    try {
        // 요청에서 추출해야 하는 정보
        const { name, manufactureDate, shelfLifeDays, category, openedDate } = req.body;

        // 사용자가 제품명, 개봉일, 카테고리를 입력 안 했을 경우 에러 처리
        if (!name || !openedDate || !category) {
            return res.status(400).json({ error: '이름, 개봉일자, 카테고리는 필수 입력 항목입니다.' });
        }

        // 날짜 형식 유효성 검사
        if (isNaN(new Date(openedDate))) {
            return res.status(400).json({ error: '유효한 개봉일자를 입력하세요.' });
        }
        if (manufactureDate && isNaN(new Date(manufactureDate))) {
            return res.status(400).json({ error: '유효한 제조일자를 입력하세요.' });
        }

        let expirationDate;
        let finalShelfLifeDays = shelfLifeDays;

        // 사용자가 shelfLifeDays를 제공하지 않은 경우 -> db에 저장된 기준 값으로 처리해야 
        // Category 모델을 사용하여 카테고리 정보를 데이터베이스에서 가져옴
        if (!shelfLifeDays) {
            const categoryInfo = await Category.findByPk(category);

            // 유효한 카테고리인지 확인
            if (!categoryInfo) {
                return res.status(400).json({ error: '유효한 카테고리를 찾을 수 없습니다.' });
            }

            // 기준 기간 설정
            finalShelfLifeDays = categoryInfo.shelfLifeDays;
            // 소비기한 계산
            expirationDate = calculateExpiration(openedDate, finalShelfLifeDays);
        } else {
            // 사용자가 기준 기간을 입력한 경우 그 값을 이용해서 계산
            expirationDate = calculateExpiration(openedDate, shelfLifeDays);
        }

        // 새로운 제품을 db에 생성
        const product = await Product.create({
            name,
            manufactureDate,
            shelfLifeDays: finalShelfLifeDays,
            expirationDate,
            category,
            openedDate  // openedDate를 추가
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("제품 추가 중 오류가 발생했습니다:", error);  // 콘솔에 오류 로그 추가
        res.status(500).json({ error: '제품 추가 중 오류가 발생했습니다.' });
    }
};

// 모든 제품을 조회하고 리턴하는 비동기 함수
// -> Product 모델 사용해서 db 모든 제품 조회 가능
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: {
                model: Category,
                attributes: ['name'], // 카테고리 이름 포함
            },
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("제품 조회 중 오류가 발생했습니다:", error);  // 콘솔에 오류 로그 추가
        res.status(500).json({ error: '제품 조회 중 오류가 발생했습니다.' });
    }
};
