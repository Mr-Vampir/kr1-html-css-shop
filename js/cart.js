document.addEventListener('DOMContentLoaded', () => {
  // Получаем массив корзины из localStorage или создаем пустой
  let cart = JSON.parse(localStorage.getItem('web_shop_cart')) || [];

  // ==========================================
  // ЛОГИКА ДЛЯ СТРАНИЦЫ КАТАЛОГА
  // ==========================================
  const buyButtons = document.querySelectorAll('.product-card__button');
  
  buyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.target;
      const product = {
        id: btn.dataset.id,
        title: btn.dataset.product,
        price: parseInt(btn.dataset.price, 10),
        image: btn.dataset.image || 'placeholder.jpg',
        quantity: 1
      };

      // Проверяем, есть ли уже такой товар в корзине
      const existingProduct = cart.find(item => item.id === product.id);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(product);
      }

      // Сохраняем и меняем внешний вид кнопки
      localStorage.setItem('web_shop_cart', JSON.stringify(cart));
      
      const originalText = btn.textContent;
      btn.textContent = 'Добавлено ✓';
      btn.style.backgroundColor = 'var(--color-success)';
      
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    });
  });

  // ==========================================
  // ЛОГИКА ДЛЯ СТРАНИЦЫ КОРЗИНЫ
  // ==========================================
  const cartContainer = document.getElementById('cart-container');
  const subtotalEl = document.getElementById('summary-subtotal');
  const totalEl = document.getElementById('summary-total');
  const orderForm = document.getElementById('order-form');
  const successMsg = document.getElementById('success-message');

  function renderCart() {
    if (!cartContainer) return; // Если мы не на странице корзины — выходим

    if (cart.length === 0) {
      cartContainer.innerHTML = '<li style="color: var(--color-muted); padding: var(--space-md);">Ваша корзина пуста.</li>';
      updateTotal(0);
      if(orderForm) orderForm.style.opacity = '0.5';
      return;
    }

    if(orderForm) orderForm.style.opacity = '1';
    cartContainer.innerHTML = '';

    cart.forEach(item => {
      const li = document.createElement('li');
      li.className = 'cart-items__item';
      li.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="cart-items__img">
        <div class="cart-items__info">
          <div class="cart-items__details">
            <h3 class="cart-items__title">${item.title}</h3>
          </div>
          <div class="cart-items__quantity">
            <button type="button" class="cart-items__qty-btn btn-minus" data-id="${item.id}">—</button>
            <input type="number" class="cart-items__qty-input" value="${item.quantity}" min="1" readonly>
            <button type="button" class="cart-items__qty-btn btn-plus" data-id="${item.id}">+</button>
          </div>
          <div class="cart-items__price">${item.price * item.quantity} ₽</div>
        </div>
        <button type="button" class="cart-items__delete-btn btn-delete" data-id="${item.id}" title="Удалить">✕</button>
      `;
      cartContainer.appendChild(li);
    });

    calculateTotal();
  }

  function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updateTotal(total);
  }

  function updateTotal(amount) {
    if (subtotalEl) subtotalEl.textContent = `${amount.toLocaleString()} ₽`;
    if (totalEl) totalEl.textContent = `${amount.toLocaleString()} ₽`;
  }

  // Слушатель кликов внутри корзины (плюс, минус, удалить)
  if (cartContainer) {
    cartContainer.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      if (!id) return;

      const product = cart.find(item => item.id === id);

      if (e.target.classList.contains('btn-plus')) {
        product.quantity += 1;
      } else if (e.target.classList.contains('btn-minus')) {
        if (product.quantity > 1) product.quantity -= 1;
      } else if (e.target.classList.contains('btn-delete')) {
        cart = cart.filter(item => item.id !== id);
      }

      localStorage.setItem('web_shop_cart', JSON.stringify(cart));
      renderCart();
    });
  }

  // Обработка отправки формы
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (cart.length === 0) {
        alert('Нельзя оформить заказ с пустой корзиной!');
        return;
      }

      if (orderForm.checkValidity()) {
        if (successMsg) successMsg.removeAttribute('hidden');
        
        // Очищаем корзину после успешной покупки
        cart = [];
        localStorage.removeItem('web_shop_cart');
        renderCart();
        orderForm.reset();
      } else {
        alert('Пожалуйста, заполните обязательные поля формы.');
      }
    });
  }

  // Первичный рендер при загрузке страницы корзины
  renderCart();
});
