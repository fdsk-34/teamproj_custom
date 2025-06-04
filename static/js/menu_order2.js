// 장바구니 데이터 저장
let cart = [];

// 모달 요소
const orderModal = document.querySelector('.modal');
const cartModal = document.querySelector('.cart-modal');
const modalPrice = document.getElementById('modal-price');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');

// 디버깅: 요소가 제대로 선택되었는지 확인
if (!orderModal) console.error('orderModal(.modal) 요소를 찾을 수 없습니다.');
if (!cartModal) console.error('cartModal(.cart-modal) 요소를 찾을 수 없습니다.');
if (!modalPrice) console.error('modalPrice(#modal-price) 요소를 찾을 수 없습니다.');
if (!cartTotal) console.error('cartTotal(#cart-total) 요소를 찾을 수 없습니다.');
if (!cartCount) console.error('cartCount(#cart-count) 요소를 찾을 수 없습니다.');
if (!cartItems) console.error('cartItems(#cart-items) 요소를 찾을 수 없습니다.');

// 장바구니 버튼 클릭 시 주문 모달 표시
document.querySelectorAll('.cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const name = button.getAttribute('data-name');
        const price = parseInt(button.getAttribute('data-price'));
        modalPrice.textContent = price.toLocaleString();
        orderModal.style.display = 'flex';
        orderModal.dataset.name = name;
        orderModal.dataset.price = price;
    });
});

// 모달 닫기
document.getElementById('close-modal').addEventListener('click', () => {
    orderModal.style.display = 'none';
});

// 장바구니 모달 표시
const cartLink = document.getElementById('cart-link');
if (!cartLink) console.error('cartLink(#cart-link) 요소를 찾을 수 없습니다.');
cartLink.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('cart-link 클릭됨');
    cartModal.style.display = 'flex';
    updateCartDisplay();
});

// 장바구니 모달 닫기
const closeCart = document.getElementById('close-cart');
if (!closeCart) console.error('closeCart(#close-cart) 요소를 찾을 수 없습니다.');
closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// 장바구니에 추가
const addToCart = document.getElementById('add-to-cart');
if (!addToCart) console.error('addToCart(#add-to-cart) 요소를 찾을 수 없습니다.');
addToCart.addEventListener('click', () => {
    const name = orderModal.dataset.name;
    const basePrice = parseInt(orderModal.dataset.price);
    const temperature = document.querySelector('input[name="temperature"]:checked').value;
    const extraShot = document.querySelector('input[name="extra-shot"]').checked ? 500 : 0;
    const bundlePrice = parseInt(document.getElementById('bundle-select').value) || 0;
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = (basePrice + extraShot + bundlePrice) * quantity;

    cart.push({
        name,
        temperature,
        extraShot: extraShot > 0,
        bundle: document.getElementById('bundle-select').selectedOptions[0].text,
        quantity,
        totalPrice
    });

    updateCartDisplay();
    orderModal.style.display = 'none'; // 옵션 모달 닫기
    cartModal.style.display = 'flex'; // 장바구니 모달 표시
});

// 장바구니 표시 업데이트
function updateCartDisplay() {
    const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    cartTotal.textContent = total.toLocaleString();
    cartCount.textContent = cart.length;
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-item-details">
                <p>${item.name} (${item.temperature}, 샷 추가: ${item.extraShot ? 'O' : 'X'}, 묶음: ${item.bundle}, 수량: ${item.quantity}) - ₩${item.totalPrice.toLocaleString()}</p>
            </div>
            <button class="delete-btn" data-index="${index}">삭제</button>
        </div>
    `).join('');

    // 삭제 버튼에 이벤트 리스너 추가
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = parseInt(button.getAttribute('data-index'));
            cart.splice(index, 1); // 해당 인덱스의 항목 제거
            updateCartDisplay(); // 모달 유지, 화면 갱신
        });
    });
}

// 전체 초기화
const clearCart = document.getElementById('clear-cart');
if (!clearCart) console.error('clearCart(#clear-cart) 요소를 찾을 수 없습니다.');
clearCart.addEventListener('click', () => {
    cart = []; // 장바구니 배열 초기화
    updateCartDisplay(); // 모달 유지, 화면 갱신
});

// 결제하기
const checkout = document.getElementById('checkout');
if (!checkout) console.error('checkout(#checkout) 요소를 찾을 수 없습니다.');
checkout.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (name.length < 2) {
        alert('이름을 2자 이상 입력해주세요.');
        return;
    }
    if (!/^\d{10,11}$/.test(phone)) {
        alert('유효한 연락처를 입력해주세요.');
        return;
    }
    if (address.length < 5) {
        alert('주소를 5자 이상 입력해주세요.');
        return;
    }

    alert('결제가 완료되었습니다!');
    cart = [];
    updateCartDisplay();
    cartModal.style.display = 'none';
});