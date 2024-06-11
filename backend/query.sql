-- 대략적인 제공 기능별 mysql 쿼리 적어봤습니다
-- 수정이 아주 많이 필요한 상태입니당 - 준희


-- 모든 제품 정보 조회
SELECT p.*, c.categoryName
FROM products p
JOIN categories c ON p.categoryID = c.categoryID;

-- 특정 제품 정보 조회 ex 2022
SELECT p.*, c.categoryName
FROM products p
JOIN categories c ON p.categoryID = c.categoryID
WHERE p.productID = 2022;

-- 특정 기간 제품 조회 ex 2024-01-01 ~ 2024-06-06
SELECT p.*, c.categoryName
FROM products p
JOIN categories c ON p.categoryID = c.categoryID
WHERE p.createdDate BETWEEN '2024-01-01' AND '2024-06-06';

-- 제품명이나 카테고리로 제품 조회 ex 수분에센스 / 메이크업
SELECT p.*, c.categoryName
FROM products p
JOIN categories c ON p.categoryID = c.categoryID
WHERE p.productName LIKE '%수분에센스%' OR p.manufacturer LIKE '%메이크업%';

-- 소비기한 임박 제품 조회 ex 7일 이내
SELECT p.*, c.categoryName
FROM products p
JOIN categories c ON p.categoryID = c.categoryID
WHERE p.expirationDate < DATE_ADD(CURDATE(), INTERVAL 7 DAY);  -- 이내로 취급할 기간 정하기

--

