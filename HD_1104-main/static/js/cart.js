 /* ───────────────────────────────────────────────────────────────────────── 
                            장바구니 담기 기능용 JS                             
   ───────────────────────────────────────────────────────────────────────── */
  
    const CART_KEY = 'shoppingCart';

    function loadCart() {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    }

    function saveCart(cart) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function addToCart(item) {
      const cart = loadCart();
      // 이미 장바구니에 동일 상품이 있는지 확인 (이름 기준)
      const existingIndex = cart.findIndex(cartItem => cartItem.name === item.name);
      if (existingIndex > -1) {
        // 있으면 수량만 증가
        cart[existingIndex].qty += 1;
      } else {
        // 없으면 새 항목 추가 (qty 기본 1)
        item.qty = 1;
        cart.push(item);
      }
      saveCart(cart);
      alert(`${item.name}이(가) 장바구니에 추가되었습니다.`);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('.card');
        const name = card.dataset.name;
        const price = parseInt(card.dataset.price, 10);
        const img = card.dataset.img;

        addToCart({ name, price, img });
      });
    });