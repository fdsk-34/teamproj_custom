document.addEventListener("DOMContentLoaded", function () {
    let currentItem = {};
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    window.openAddToCartModal = function (name, price) {
        console.log("모달 열기:", name, price);
        currentItem = { name, price };
        const modalName = document.getElementById("modal-item-name");
        const modalPrice = document.getElementById("modal-item-price");
        if (!modalName || !modalPrice) {
            console.error("모달 요소를 찾을 수 없습니다:", { modalName, modalPrice });
            return;
        }
        modalName.innerText = name;
        modalPrice.innerText = price;
        const modal = document.getElementById("add-to-cart-modal");
        modal.style.display = "flex";
        window.scrollTo(0, 0);
        console.log("모달 스타일:", modal.style.display, modal.style.background);
    };

    window.closeAddToCartModal = function () {
        const modal = document.getElementById("add-to-cart-modal");
        modal.style.display = "none";
    };

    window.addToCart = function () {
        console.log("addToCart 호출");
        const tempRadio = document.querySelector('input[name="temp"]:checked');
        const extraShot = document.getElementById("extra-shot");
        const syrup = document.getElementById("syrup");
        const quantity = document.getElementById("quantity");

        if (!tempRadio) {
            alert("온도를 선택해주세요.");
            return;
        }
        if (!extraShot || !syrup || !quantity) {
            console.error("입력 요소를 찾을 수 없습니다:", { extraShot, syrup, quantity });
            alert("입력 요소를 찾을 수 없습니다. 관리자에게 문의하세요.");
            return;
        }

        const temp = tempRadio.value;
        const shot = extraShot.checked ? 500 : 0;
        const syrupValue = syrup.value;
        const qty = parseInt(quantity.value) || 1;

        const item = {
            name: currentItem.name,
            price: currentItem.price,
            temp,
            shot: shot > 0,
            syrup: syrupValue,
            qty,
            totalPrice: (currentItem.price + shot) * qty
        };

        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        console.log("장바구니에 추가:", item);
        updateCartCount();
        closeAddToCartModal();
        setTimeout(() => {
            openCartModal();
        }, 0);
    };

    window.updateCartCount = function () {
        const cartCount = document.querySelector(".cart-count");
        if (cartCount) {
            cartCount.innerText = cart.length;
        } else {
            console.error("cart-count 요소를 찾을 수 없습니다.");
        }
    };

    window.openCartModal = function () {
        updateCartUI();
        const cartModal = document.getElementById("cart-modal");
        if (!cartModal) {
            console.error("cart-modal 요소를 찾을 수 없습니다.");
            return;
        }
        cartModal.style.display = "flex";
        window.scrollTo(0, 0);
        console.log("카트 모달 열기:", cartModal.style.display);
    };

    window.closeCartModal = function () {
        const cartModal = document.getElementById("cart-modal");
        if (cartModal) {
            cartModal.style.display = "none";
        }
    };

    window.updateCartUI = function () {
        const cartItemsDiv = document.getElementById("cart-items");
        const total = document.getElementById("cart-total");
        if (!cartItemsDiv || !total) {
            console.error("cart-items 또는 cart-total 요소를 찾을 수 없습니다.");
            return;
        }
        cartItemsDiv.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "cart-item";
            itemDiv.innerHTML = `
                <p>${item.name} (${item.temp}) ${item.shot ? "샷추가" : ""} ${item.syrup !== 'none' ? item.syrup : ''} x ${item.qty} - ₩${item.totalPrice}</p>
                <button class="btn" onclick="removeFromCart(${index})">삭제</button>
            `;
            cartItemsDiv.appendChild(itemDiv);
            totalPrice += item.totalPrice;
        });

        total.textContent = totalPrice;
        console.log("장바구니 UI 갱신:", cart);
    };

    window.removeFromCart = function (index) {
        console.log("삭제 시도: 인덱스", index);
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            updateCartUI();
            console.log("삭제 완료: 새 장바구니", cart);
        } else {
            console.error("잘못된 인덱스:", index);
        }
    };

    window.checkout = function () {
        const cartModal = document.getElementById("cart-modal");
        if (cartModal) {
            cartModal.style.display = "flex";
            updateCartUI();
        } else {
            console.error("cart-modal 요소를 찾을 수 없습니다.");
        }
    };

    window.closeCheckoutModal = function () {
        const cartModal = document.getElementById("cart-modal");
        if (cartModal) {
            cartModal.style.display = "none";
        }
    };

    window.submitOrder = function () {
        const name = document.getElementById("checkout-name");
        const phone = document.getElementById("checkout-phone");
        const address = document.getElementById("checkout-address");
        const payment = document.querySelector('input[name="payment"]:checked');

        if (!name || !phone || !address) {
            console.error("결제 입력 요소를 찾을 수 없습니다:", { name, phone, address });
            alert("결제 입력 요소를 찾을 수 없습니다. 관리자에게 문의하세요.");
            return;
        }

        if (!name.value || name.value.length < 2) {
            alert("이름을 2자 이상 입력해주세요.");
            return;
        }
        if (!phone.value || phone.value.length < 10) {
            alert("유효한 연락처를 입력해주세요.");
            return;
        }
        if (!address.value || address.value.length < 5) {
            alert("주소를 5자 이상 입력해주세요.");
            return;
        }
        if (!payment) {
            alert("결제 수단을 선택해주세요.");
            return;
        }

        console.log("결제 처리:", { name: name.value, phone: phone.value, address: address.value, payment: payment.value });
        alert("결제가 완료되었습니다! 감사합니다 :)");
        cart = [];
        localStorage.removeItem("cart");
        updateCartCount();
        updateCartUI();
        closeCartModal();
    };

    window.clearCart = function () {
        console.log("장바구니 전체 삭제 시도");
        cart = [];
        localStorage.removeItem("cart");
        updateCartCount();
        updateCartUI();
        console.log("장바구니 전체 삭제 완료");
    };

    const cartButton = document.querySelector(".cart-count");
    if (cartButton) {
        cartButton.parentElement.addEventListener("click", openCartModal);
    } else {
        console.error("cart-count 버튼을 찾을 수 없습니다.");
    }

    updateCartCount();
});