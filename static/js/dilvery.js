// 조회 기록 로드
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        let currentOrders = [];
        updateSearchHistoryDropdown();

        function updateSearchHistoryDropdown() {
            const historySelect = document.getElementById('search-history');
            historySelect.innerHTML = '<option value="">최근 조회 기록</option>';
            searchHistory.forEach(history => {
                historySelect.innerHTML += `<option value="${history.orderId}">${history.orderId}</option>`;
            });
        }

        function saveSearchHistory(orderIds) {
            orderIds.forEach(orderId => {
                searchHistory = searchHistory.filter(h => h.orderId !== orderId);
                searchHistory.unshift({ orderId, timestamp: new Date().toISOString() });
            });
            if (searchHistory.length > 5) {
                searchHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                searchHistory = searchHistory.slice(0, 5);
            }
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateSearchHistoryDropdown();
        }

        function clearSearchHistory() {
            searchHistory = [];
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
            updateSearchHistoryDropdown();
            alert('조회 기록이 삭제되었습니다.');
        }

        function selectSearchHistory() {
            const historySelect = document.getElementById('search-history');
            if (historySelect.value) {
                document.getElementById('order-id').value = historySelect.value;
            }
        }

        function resetSearch() {
            document.getElementById('order-id').value = '';
            document.getElementById('sort-order').value = 'latest';
            document.getElementById('status-filter').value = '';
            document.getElementById('order-id-error').style.display = 'none';
            document.getElementById('no-order').style.display = 'none';
            closeOrderPanel();
        }

        function openOrderPanel() {
            document.getElementById('modal-overlay').style.display = 'block';
            document.getElementById('order-details-panel').classList.add('open');
        }

        function closeOrderPanel() {
            document.getElementById('order-details-panel').classList.remove('open');
            document.getElementById('modal-overlay').style.display = 'none';
            document.getElementById('order-select').innerHTML = '<option value="">주문을 선택하세요</option>';
            document.getElementById('order-details-content').innerHTML = '';
            currentOrders = [];
        }

        function displayOrderDetails(orderId) {
            const order = currentOrders.find(o => o.orderId === orderId);
            if (!order) return;
            const content = document.getElementById('order-details-content');
            content.innerHTML = `
                <div class="order-details">
                    <h3>주문 정보</h3>
                    <p><strong>주문 번호:</strong> <span>${order.orderId}</span></p>
                    <p><strong>배송지:</strong> <span>${order.address}</span></p>
                    <p><strong>연락처:</strong> <span>${order.phone}</span></p>
                    <p><strong>결제 수단:</strong> <span>${order.payment === 'card' ? '신용카드' : '간편결제'}</span></p>
                    <p><strong>총액:</strong> ₩<span>${order.total}</span></p>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <p>${item.name} (${item.temp}, ${item.extraShot ? '샷 추가, ' : ''}${item.syrup !== 'none' ? item.syrup + ' 시럽' : ''}) 
                                - ₩${item.price} x ${item.quantity}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="status-timeline">
                        <div class="status-step ${order.status === '주문 접수' ? 'active' : ''}" data-status="주문 접수">주문 접수</div>
                        <div class="status-step ${order.status === '배송 준비' ? 'active' : ''}" data-status="배송 준비">배송 준비</div>
                        <div class="status-step ${order.status === '배송 중' ? 'active' : ''}" data-status="배송 중">배송 중</div>
                        <div class="status-step ${order.status === '완료' ? 'active' : ''}" data-status="완료">완료</div>
                        <div class="status-step ${order.status === '취소됨' ? 'active' : ''}" data-status="취소됨">취소됨</div>
                    </div>
                    <button class="btn cancel-btn" ${order.status !== '주문 접수' ? 'disabled' : ''} onclick="openCancelPanel('${order.orderId}')">취소</button>
                    <button class="btn close-btn" onclick="closeOrderPanel()">닫기</button>
                </div>
            `;
        }

        function trackOrder() {
            const orderIdInput = document.getElementById('order-id').value.trim();
            const sortOrder = document.getElementById('sort-order').value;
            const statusFilter = document.getElementById('status-filter').value;
            const orderIdError = document.getElementById('order-id-error');
            const noOrder = document.getElementById('no-order');

            // 초기화
            orderIdError.style.display = 'none';
            noOrder.style.display = 'none';
            closeOrderPanel();

            // 주문 번호 파싱
            const orderIds = orderIdInput ? orderIdInput.split(',').map(id => id.trim()).filter(id => id) : [];
            const invalidIds = orderIds.filter(id => !/^ORD\d+$/.test(id));

            // 유효성 검사
            if (orderIds.length === 0 && statusFilter === '') {
                orderIdError.textContent = '주문 번호를 입력하거나 상태를 선택해주세요.';
                orderIdError.style.display = 'block';
                return;
            }
            if (invalidIds.length > 0) {
                orderIdError.textContent = `유효하지 않은 주문 번호: ${invalidIds.join(', ')}`;
                orderIdError.style.display = 'block';
                return;
            }

            // 주문 조회
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            let filteredOrders = orders;

            // 상태 필터 적용
            if (statusFilter) {
                filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
            }

            // 주문 번호 필터 적용
            if (orderIds.length > 0) {
                filteredOrders = filteredOrders.filter(o => orderIds.includes(o.orderId));
            }

            if (filteredOrders.length === 0) {
                noOrder.style.display = 'block';
                return;
            }

            // 조회 기록 저장
            if (orderIds.length > 0) {
                saveSearchHistory(orderIds);
            }

            // 정렬
            filteredOrders.sort((a, b) => {
                if (sortOrder === 'total-asc') return a.total - b.total;
                if (sortOrder === 'total-desc') return b.total - a.total;
                return new Date(b.createdAt) - new Date(a.createdAt); // latest
            });

            // 주문 패널 표시
            currentOrders = filteredOrders;
            const orderSelect = document.getElementById('order-select');
            orderSelect.innerHTML = '<option value="">주문을 선택하세요</option>';
            filteredOrders.forEach(order => {
                orderSelect.innerHTML += `<option value="${order.orderId}">${order.orderId}</option>`;
            });
            if (filteredOrders.length > 0) {
                orderSelect.value = filteredOrders[0].orderId;
                displayOrderDetails(filteredOrders[0].orderId);
                openOrderPanel();
            }
        }

        function openCancelPanel(orderId) {
            document.getElementById('cancel-message').textContent = `주문 번호 ${orderId}을 취소하시겠습니까?`;
            document.getElementById('cancel-panel').dataset.orderId = orderId;
            document.getElementById('modal-overlay').style.display = 'block';
            document.getElementById('cancel-panel').classList.add('open');
        }

        function closeCancelPanel() {
            document.getElementById('cancel-panel').classList.remove('open');
            document.getElementById('modal-overlay').style.display = 'none';
            document.getElementById('cancel-panel').dataset.orderId = '';
        }

        function confirmCancel() {
            const orderId = document.getElementById('cancel-panel').dataset.orderId;
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            const order = orders.find(o => o.orderId === orderId);
            if (order && order.status === '주문 접수') {
                order.status = '취소됨';
                localStorage.setItem('orders', JSON.stringify(orders));
                alert(`주문 번호 ${orderId}이 취소되었습니다.`);
                closeCancelPanel();
                trackOrder();
            }
        }

        // Enter 키로 조회
        document.getElementById('order-id').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') trackOrder();
        });