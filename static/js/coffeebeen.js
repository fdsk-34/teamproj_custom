
let currentItem = {};
let cart = [];

function openAddToCartModal(name, price) {
    currentItem = { name, price };
    document.getElementById("modal-item-name").innerText = name;
    document.getElementById("modal-item-price").innerText = price;
    document.getElementById("add-to-cart-modal").style.display = "block";
}

function closeAddToCartModal() {
    document.getElementById("add-to-cart-modal").style.display = "none";
}

function addToCart() {
    const temp = document.querySelector('input[name="temp"]:checked').value;
    const shot = document.getElementById("extra-shot").checked ? 500 : 0;
    const syrup = document.getElementById("syrup").value;
    const qty = parseInt(document.getElementById("quantity").value);
    const totalPrice = (currentItem.price + shot) * qty;

    const item = {
        name: currentItem.name,
        price: currentItem.price,
        temp,
        shot: shot > 0,
        syrup,
        qty,
        totalPrice
    };

    function removeFromCart(index) {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        openCartModal(); // 다시 열어서 UI 갱신
        updateCartCount();
    }



    function updateCartUI() {
        const cartItemsDiv = document.getElementById("cart-items");
        const total = document.getElementById("cart-total");
        cartItemsDiv.innerHTML = "";
        let totalPrice = 0;

        cart.forEach((item, index) => {
            const itemDiv = document.createElement("div");
            itemDiv.innerHTML = `
      <p>${item.name} (${item.temp}) ${item.shot ? "샷추가" : ""} ${item.syrup !== 'none' ? item.syrup : ''} x ${item.qty} - ₩${item.price * item.qty}</p>
      <button onclick="removeFromCart(${index})">삭제</button>
    `;
            cartItemsDiv.appendChild(itemDiv);
            totalPrice += item.price * item.qty + (item.shot ? 500 : 0);
        });

        total.textContent = totalPrice;
    }


    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));

    closeAddToCartModal();
    updateCartCount();
    openCartModal();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    document.querySelector(".cart-count").innerText = cart.length;
}

function openCartModal() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
      <p>${item.name} (${item.temp}, 시럽: ${item.syrup}, 샷: ${item.shot ? "추가" : "없음"}) - ${item.qty}개 ₩${item.totalPrice}</p>
    `;
        total += item.totalPrice;
        container.appendChild(div);
    });
    

    document.getElementById("cart-total").innerText = total;
    document.getElementById("cart-modal").style.display = "block";
}

function closeCartModal() {
    document.getElementById("cart-modal").style.display = "none";
}

function checkout() {
    document.getElementById("checkout-modal").style.display = "block";
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").style.display = "none";
}

function submitOrder() {
    const name = document.getElementById("checkout-name").value;
    const phone = document.getElementById("checkout-phone").value;
    const address = document.getElementById("checkout-address").value;

    if (name.length < 2 || phone.length < 10 || address.length < 5) {
        alert("모든 정보를 올바르게 입력해주세요.");
        return;
    }

    alert("결제가 완료되었습니다! 감사합니다 :)");
    localStorage.removeItem("cart");
    closeCheckoutModal();
    closeCartModal();
    updateCartCount();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartCount();
  openCartModal(); // 장바구니 모달 다시 열어 목록 초기화
}

