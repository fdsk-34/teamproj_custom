 let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        function updateCart() {
            const cartItems = document.getElementById('cartItems');
            const cartCount = document.querySelector('.cart-count');
            const cartTotal = document.getElementById('cartTotal');
            cartItems.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                total += item.price * item.quantity;
                cartItems.innerHTML += `
                    <div>
                        <p>${item.name} - ₩${item.price} x 
                            <button onclick="updateQuantity(${index}, -1)">-</button>
                            ${item.quantity}
                            <button onclick="updateQuantity(${index}, 1)">+</button>
                            <button onclick="removeItem(${index})">삭제</button>
                    </div>`;
            });
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotal.textContent = total;
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function updateQuantity(index, change) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) cart.splice(index, 1);
            updateCart();
        }

        function removeItem(index) {
            cart.splice(index, 1);
            updateCart();
        }

        function openModal() {
            document.getElementById('cartModal').style.display = 'flex';
            updateCart();
        }

        function closeModal() {
            document.getElementById('cartModal').style.display = 'none';
        }

        function proceedToOrder() {
            if (cart.length === 0) {
                alert('장바구니가 비어 있습니다.');
                return;
            }
            closeModal();
            window.location.href = './order_page.html';
        }

        function getDeliveryStatus(orderTime) {
            const now = Date.now();
            const hoursSinceOrder = (now - orderTime) / (1000 * 60 * 60);
            if (hoursSinceOrder < 1) return { status: '주문 접수', class: 'status-pending' };
            if (hoursSinceOrder < 2) return { status: '배송 준비 중', class: 'status-preparing' };
            if (hoursSinceOrder < 24) return { status: '배송 중', class: 'status-shipping' };
            return { status: '배송 완료', class: 'status-delivered' };
        }

        function displayOrders(filteredOrders) {
            const orderList = document.getElementById('orderList');
            orderList.innerHTML = '';
            if (filteredOrders.length === 0) {
                orderList.innerHTML = '<p>주문 내역이 없습니다.</p>';
                return;
            }
            filteredOrders.forEach(order => {
                const status = getDeliveryStatus(parseInt(order.orderId.replace('ORD', '')));
                const itemsList = order.items.map(item => `${item.name} (₩${item.price} x ${item.quantity})`).join(', ');
                orderList.innerHTML += `
                    <div class="order-item">
                        
                        <div class="order-item-details">
                            <h3>주문 번호: ${order.orderId}</h3>
                            <p>주문자: ${order.name}</p>
                            <p>주문 항목: ${itemsList}</p>
                            <p>총액: ₩${order.total}</p>
                            <p>배송지: ${order.address}</p>
                            <p>연락처: ${order.phone}</p>
                            <p>결제 수단: ${order.payment === 'card' ? '신용카드' : '간편결제'}</p>
                            <p>배송 상태: <span class="${status.class}">${status.status}</span></p>
                        </div>
                    </div>`;
            });
        }

        function searchOrders() {
            const query = document.getElementById('query').value.trim().toLowerCase();
            if (!query) {
                alert('주문 번호 또는 이름을 입력해주세요.');
                return;
            }
            const filteredOrders = orders.filter(order => 
                order.orderId.toLowerCase().includes(query) || 
                order.name.toLowerCase().includes(query)
            );
            displayOrders(filteredOrders);
        }

        document.querySelector('.cart-icon').addEventListener('click', openModal);

        // Initial display of all orders
        document.addEventListener('DOMContentLoaded', () => {
            displayOrders(orders);
        });