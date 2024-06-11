$(function() {
    init();
});

function init() {
    // 상품 정보 로드
    var products = [];
    getProducts(function(datas) {
        products = datas;
        products.forEach(function(product, index) {
            appendProduct(product, index);
        });
    });

    // Drop 영역 설정
    $('#drop-area').droppable({
        drop: function(event, ui) {
            var item = $(ui.draggable);
            var index = item.attr('data-index');
            var img = item.find('img');
            var productName = item.find('.product-name').text();
            var brandName = item.find('.brand-name').text();
            var price = item.find('.price').text();

            // 상품 원위치 시키기
            item.css({
                position: 'relative',
                top: 'auto',
                left: 'auto'
            });

            var productInBasket = $(`#basket-list [data-index=${index}]`);
            if (productInBasket.length) {
                // 중복되는 상품이 있을 경우
                alert('이미 장바구니에 담긴 상품입니다.');
                return;
            }

            var newItem = $(`
            <div class="card-deck">
                <div class="card mb-3" style="max-width: 540px;" data-index="${index}">
                    <div class="row no-gutters">
                        <div class="col-md-4 overflow-hidden">
                            <img src="${img.attr('src')}" class="card-img h-100 w-auto" alt="${productName}" title="${productName}">
                        </div>
                        <div class="col-md-7">
                            <div class="card-body">
                            <h5 class="card-title">${productName}</h5>
                            <p class="card-text">${brandName}</p>
                            <p class="card-text"><small class="text-muted">${price}</small></p>
                            <p class="card-text">
                                <div class="input-group input-group-sm mb-3">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text" id="inputGroup-sizing-sm-${index}">수량</span>
                                    </div>
                                    <input type="number" min="1" value="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm-${index}">
                                </div>
                            </p>
                            <p class="card-text">합계 <span class="sum">${price}</span>원</p>
                            </div>
                        </div>
                        <button type="button" class="col-md-1 btn-delete">X</button>
                    </div>
                </div>
            </div>
            `);

            newItem.find("input[type='number']").on('keyup change', function() {
                var sum = parseInt(price, 10) * $(this).val();
                newItem.find('.sum').text(sum);

                setTotalSum();
            });

            newItem.find('button.btn-delete').on('click', function() {
                newItem.remove();
                setTotalSum();
            });

            $('#basket-list').append(newItem);
            setTotalSum();
        }
    });
}

function setTotalSum() {
    var totalSum = 0;

    $('#basket-list .sum').each(function() {
        totalSum += parseInt($(this).text(), 10);
    });

    $('#total-sum').text(totalSum);
}

function getProducts(cb) {
    $.ajax({
        url: 'resources/json/store.json',
        success: function(datas) {
            cb(datas.products);
        }
    });
}

function appendProduct(product, index) {
    var newItem = $(`
        <div class="card col-4 p-0" data-index="${index}">
            <img src="resources/images/${product.photo}" class="card-img-top" alt="${product.product_name}" title="${product.product_name}">
            <div class="card-body">
                <h5 class="card-title product-name">${product.product_name}</h5>
                <p class="card-text brand-name">${product.brand_name}</p>
            </div>
            <div class="card-footer">
                <small class="text-muted price">${product.price}</small>
            </div>
        </div>
    `).draggable({
        zIndex: 999,
        revert: 'invalid'
    });

    $('#product-list').append(newItem);
}