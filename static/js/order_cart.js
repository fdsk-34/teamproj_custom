 let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
            // 주문 폼으로 스크롤 이동
            document.querySelector('.order-form').scrollIntoView({ behavior: 'smooth' });
        }

        function submitOrder() {
            const name = document.getElementById('name').value;
            const address = document.getElementById('address').value;
            const phone = document.getElementById('phone').value;
            const payment = document.getElementById('payment').value;

            if (!name || !address || !phone) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const order = {
                items: cart,
                name,
                address,
                phone,
                payment,
                total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
                orderId: 'ORD' + Date.now()
            };

            // 모의 API 호출 (실제로는 백엔드 엔드포인트로 전송)
            console.log('주문 데이터:', order);
            alert(`주문 완료! 주문 번호: ${order.orderId}`);
            localStorage.removeItem('cart');
            cart = [];
            updateCart();
            window.location.href = './07_teamproj_order_page.html';
        }

        document.querySelector('.cart-icon').addEventListener('click', openModal);

        // 메뉴 페이지에서 호출될 함수 예시
        function addToCart(name, price) {
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            updateCart();
            localStorage.setItem('cart', JSON.stringify(cart));
        }