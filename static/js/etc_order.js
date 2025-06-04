
document.addEventListener('DOMContentLoaded', () => {
    let currentItem = null;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    window.openAddToCartModal = function(name, basePrice) {
        console.log('openAddToCartModal called with:', name, basePrice);
        const modal = document.getElementById('add-to-cart-modal');
        if (!modal) {
            alert('장바구니 추가 모달 요소를 찾을 수 없습니다. HTML에서 ID를 확인하세요.');
            return;
        }
        currentItem = { name, basePrice };
        const nameElement = document.getElementById('modal-item-name');
        const priceElement = document.getElementById('modal-item-price');
        const quantityElement = document.getElementById('quantity');
        const extraShotElement = document.getElementById('extra-shot');
        const deliveryElement = document.getElementById('delivery');
        const locationElement = document.querySelector('input[name="location"][value="designated"]');

        if (!nameElement || !priceElement || !quantityElement || !extraShotElement || !deliveryElement || !locationElement) {
            alert('장바구니 추가 모달 내부 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
            console.error('Missing elements:', { nameElement, priceElement, quantityElement, extraShotElement, deliveryElement, locationElement });
            return;
        }

        nameElement.textContent = name;
        priceElement.textContent = basePrice;
        quantityElement.value = 1;
        extraShotElement.checked = false;
        deliveryElement.value = 'none';
        locationElement.checked = true;
        modal.style.display = 'flex';
    };

    window.closeAddToCartModal = function() {
        const modal = document.getElementById('add-to-cart-modal');
        if (modal) modal.style.display = 'none';
        currentItem = null;
    };

    window.addToCart = function() {
        if (!currentItem) return;
        const item = {
            itemId: 'ITEM' + Date.now(),
            name: currentItem.name,
            basePrice: currentItem.basePrice,
            location: document.querySelector('input[name="location"]:checked').value,
            extraShot: document.getElementById('extra-shot').checked,
            delivery: document.getElementById('delivery').value,
            quantity: parseInt(document.getElementById('quantity').value) || 1
        };
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${item.name}이(가) 장바구니에 추가되었습니다.`);
        closeAddToCartModal();
        openCartModal();
    };

    window.openCartModal = function() {
        console.log('openCartModal called');
        const cartModal = document.getElementById('cart-modal');
        if (!cartModal) {
            alert('장바구니 모달 요소를 찾을 수 없습니다. HTML에서 ID를 확인하세요.');
            console.error('Cart modal element missing');
            return;
        }
        displayCartItems();
        cartModal.style.display = 'flex';
    };

    window.closeCartModal = function() {
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) cartModal.style.display = 'none';
        document.querySelectorAll('.error').forEach(e => e.style.display = 'none');
    };

    function displayCartItems() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartShipping = document.getElementById('cart-shipping');
        if (!cartItems || !cartTotal || !cartShipping) {
            alert('장바구니 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
            console.error('Missing cart elements:', { cartItems, cartTotal, cartShipping });
            return;
        }
        cartItems.innerHTML = '';
        let subtotal = 0;
        cart.forEach(item => {
            let price = item.basePrice;
            if (item.extraShot) price += 0;
            if (item.delivery !== 'none') price += 5000;
            const itemTotal = price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-details">
                    <strong>${item.name}</strong><br>
                    수령장소: ${item.location === 'designated' ? '지정 장소' : '지정 외 장소'}, 
                    대리 수령: ${item.extraShot ? '예' : '아니오'}, 
                    배송: ${item.delivery === 'none' ? '없음' : item.delivery === 'same-day' ? '당일 배송' : '휴일 배송'}<br>
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
        cartTotal.textContent = subtotal + shipping;
        cartShipping.textContent = shipping;
    }

    window.updateCartItemQuantity = function(itemId, quantity) {
        const item = cart.find(i => i.itemId === itemId);
        if (item) {
            item.quantity = parseInt(quantity) || 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCartItems();
        }
    };

    window.removeCartItem = function(itemId) {
        cart = cart.filter(i => i.itemId !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    };

    function validateOrderForm() {
        const name = document.getElementById('cart-name');
        const address = document.getElementById('cart-address');
        const phone = document.getElementById('cart-phone');
        if (!name || !address || !phone) {
            alert('주문 폼 요소를 찾을 수 없습니다. HTML ID를 확인하세요.');
            return false;
        }
        const nameValue = name.value.trim();
        const addressValue = address.value.trim();
        const phoneValue = phone.value.trim();
        let isValid = true;

        document.querySelectorAll('.error').forEach(e => e.style.display = 'none');

        if (cart.length === 0) {
            alert('장바구니가 비어 있습니다.');
            return false;
        }
        if (nameValue.length < 2) {
            document.getElementById('cart-name-error').style.display = 'block';
            isValid = false;
        }
        if (addressValue.length < 5) {
            document.getElementById('cart-address-error').style.display = 'block';
            isValid = false;
        }
        if (!/^\d{3}-\d{4}-\d{4}$/.test(phoneValue)) {
            document.getElementById('cart-phone-error').style.display = 'block';
            isValid = false;
        }
        return isValid;
    }

    window.submitOrder = async function() {
        if (!validateOrderForm()) return;

        const items = cart.map(item => ({
            name: item.name,
            price: item.basePrice + (item.extraShot ? 0 : 0) + (item.delivery !== 'none' ? 5000 : 0),
            quantity: item.quantity,
            location: item.location,
            extraShot: item.extraShot,
            delivery: item.delivery
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

        try {
            console.log('Toss Payments API 호출 시뮬레이션:', {
                amount: order.total,
                orderId: order.orderId,
                orderName: '수제커피브루 주문',
                customerName: order.name
            });

            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));

            alert(`결제 완료! 주문 번호: ${order.orderId}\n총액: ₩${order.total}`);
            closeCartModal();
            window.location.href = './07_teamproj_order_page.html';
        } catch (error) {
            console.error('결제 오류:', error);
            alert('결제에 실패했습니다. 다시 시도해주세요.');
        }
    };

    // 이벤트 리스너
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
        quantityElement.addEventListener('input', () => {
            quantityElement.value = Math.max(1, parseInt(quantityElement.value) || 1);
        });
    }

    const extraShotElement = document.getElementById('extra-shot');
    if (extraShotElement) {
        extraShotElement.addEventListener('change', () => {});
    }

    const deliveryElement = document.getElementById('delivery');
    if (deliveryElement) {
        deliveryElement.addEventListener('change', () => {});
    }

    document.querySelectorAll('input[name="location"]').forEach(radio => {
        radio.addEventListener('change', () => {});
    });

    const cartPhoneElement = document.getElementById('cart-phone');
    if (cartPhoneElement) {
        cartPhoneElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitOrder();
        });
    }

    // 동적 버튼 이벤트 리스너
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = parseInt(button.dataset.price);
            openAddToCartModal(name, price);
        });
    });
});
