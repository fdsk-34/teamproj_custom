    // 장바구니 데이터 저장
        let cart = [];
        
        // 모달 요소
        const orderModal = document.querySelector('.modal');
        const cartModal = document.querySelector('.cart-modal');
        const modalPrice = document.getElementById('modal-price');
        const cartTotal = document.getElementById('cart-total');
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');

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
        document.getElementById('cart-link').addEventListener('click', (e) => {
            e.preventDefault();
            cartModal.style.display = 'flex';
            updateCartDisplay();
        });

        // 장바구니 모달 닫기
        document.getElementById('close-cart').addEventListener('click', () => {
            cartModal.style.display = 'none';
        });

        // 장바구니에 추가
        document.getElementById('add-to-cart').addEventListener('click', () => {
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
            orderModal.style.display = 'none';
        });

        // 장바구니 표시 업데이트
        function updateCartDisplay() {
            const total = cart.reduce((sum, item) => sum + item.totalPrice, 0);
            cartTotal.textContent = total.toLocaleString();
            cartCount.textContent = cart.length;
            cartItems.innerHTML = cart.map(item => `
                <p>${item.name} (${item.temperature}, 샷 추가: ${item.extraShot ? 'O' : 'X'}, 묶음: ${item.bundle}, 수량: ${item.quantity}) - ₩${item.totalPrice.toLocaleString()}</p>
            `).join('');
        }

        // 결제하기
        document.getElementById('checkout').addEventListener('click', () => {
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