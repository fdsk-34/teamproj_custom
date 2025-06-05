let currentItem = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function openAddToCartModal(name, basePrice) {
    currentItem = { name, basePrice };
    document.getElementById('modal-item-name').textContent = name;
    document.getElementById('modal-item-price').textContent = basePrice;
    document.getElementById('quantity').value = 1;
    document.getElementById('extra-shot').checked = false;
    document.getElementById('syrup').value = 'none';
    document.querySelector('input[name="temp"][value="hot"]').checked = true;
    document.getElementById('add-to-cart-modal').style.display = 'flex';
}

function closeAddToCartModal() {
    document.getElementById('add-to-cart-modal').style.display = 'none';
    currentItem = null;
}

function addToCart() {
    const item = {
        itemId: 'ITEM' + Date.now(),
        name: currentItem.name,
        basePrice: currentItem.basePrice,
        temp: document.querySelector('input[name="temp"]:checked').value,
        extraShot: document.getElementById('extra-shot').checked,
        syrup: document.getElementById('syrup').value,
        quantity: parseInt(document.getElementById('quantity').value) || 1
    };
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${item.name}이(가) 장바구니에 추가되었습니다.`);
    closeAddToCartModal();
    openCartModal();
}

function openCartModal() {
    displayCartItems();
    document.getElementById('cart-modal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');
}

function displayCartItems() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
        let price = item.basePrice;
        if (item.extraShot) price += 500;
        if (item.syrup !== 'none') price += 500;
        const itemTotal = price * item.quantity;
        subtotal += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <strong>${item.name}</strong><br>
                        온도: ${item.temp}, 샷 추가: ${item.extraShot ? '예' : '아니오'}, 
                        시럽: ${item.syrup === 'none' ? '없음' : item.syrup}<br>
                        수량: <input type="number" min="1" value="${item.quantity}" onchange="updateCartItemQuantity('${item.itemId}', this.value)">
                        가격: ₩${itemTotal}
                    </div>
                    <div class="cart-item-actions">
                        <button class="btn" onclick="removeCartItem('${item.itemId}')">삭제</button>
                    </div>
                `;
        cartItems.appendChild(cartItem);
    });

    const shipping = subtotal >= 30000 ? 0 : 3000;
    document.getElementById('cart-total').textContent = subtotal + shipping;
    document.getElementById('cart-shipping').textContent = shipping;
}

function updateCartItemQuantity(itemId, quantity) {
    const item = cart.find(i => i.itemId === itemId);
    if (item) {
        item.quantity = parseInt(quantity) || 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
}

function removeCartItem(itemId) {
    cart = cart.filter(i => i.itemId !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

function validateOrderForm() {
    const name = document.getElementById('cart-name').value.trim();
    const address = document.getElementById('cart-address').value.trim();
    const phone = document.getElementById('cart-phone').value.trim();
    let isValid = true;

    document.querySelectorAll('.error').forEach(e => e.style.display = 'none');

    if (cart.length === 0) {
        alert('장바구니가 비어 있습니다.');
        return false;
    }
    if (name.length < 2) {
        document.getElementById('cart-name-error').style.display = 'block';
        isValid = false;
    }
    if (address.length < 5) {
        document.getElementById('cart-address-error').style.display = 'block';
        isValid = false;
    }
    if (!/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
        document.getElementById('cart-phone-error').style.display = 'block';
        isValid = false;
    }
    return isValid;
}

async function submitOrder() {
    if (!validateOrderForm()) return;

    const items = cart.map(item => ({
        name: item.name,
        price: item.basePrice + (item.extraShot ? 500 : 0) + (item.syrup !== 'none' ? 500 : 0),
        quantity: item.quantity,
        temp: item.temp,
        extraShot: item.extraShot,
        syrup: item.syrup
    }));
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 30000 ? 0 : 3000;
    const order = {
        items,
        name: document.getElementById('cart-name').value.trim(),
        address: document.getElementById('cart-address').value.trim(),
        phone: document.getElementById('cart-phone').value.trim(),
        payment: document.getElementById('cart-payment').value,
        subtotal,
        shipping,
        total: subtotal + shipping,
        orderId: 'ORD' + Date.now(),
        status: '주문 접수',
        createdAt: new Date().toISOString()
    };

    // Toss Payments API 호출 (모의)
    try {
        // 실제 API 호출 예시 (키 필요)
        /*
        const response = await fetch('https://api.tosspayments.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic YOUR_TOSS_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: order.total,
                orderId: order.orderId,
                orderName: '수제커피브루 주문',
                customerName: order.name
            })
        });
        const result = await response.json();
        if (!result.success) throw new Error('결제 실패');
        */

        // 모의 결제
        console.log('Toss Payments API 호출 시뮬레이션:', {
            amount: order.total,
            orderId: order.orderId,
            orderName: '수제커피브루 주문',
            customerName: order.name
        });

        // 주문 저장
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        // 장바구니 초기화
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));

        alert(`결제 완료! 주문 번호: ${order.orderId}\n총액: ₩${order.total}`);
        closeCartModal();
        window.location.href = './07_teamproj_order_page.html';
    } catch (error) {
        console.error('결제 오류:', error);
        alert('결제에 실패했습니다. 다시 시도해주세요.');
    }
}

document.getElementById('quantity').addEventListener('input', () => {
    document.getElementById('quantity').value = Math.max(1, parseInt(document.getElementById('quantity').value) || 1);
});
document.getElementById('extra-shot').addEventListener('change', () => { });
document.getElementById('syrup').addEventListener('change', () => { });
document.querySelectorAll('input[name="temp"]').forEach(radio => radio.addEventListener('change', () => { }));

document.getElementById('cart-phone').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitOrder();
});