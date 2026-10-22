/* Реализация открытия и закрытия модального окна */
const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');

function disableScroll() {
  document.body.classList.add('no-scroll');
}
function enableScroll() {
  document.body.classList.remove('no-scroll');
}

// Проверяем, есть ли модальное окно и кнопка закрытия на этой странице
if (orderDialog && closeDialogButton) {
  // Перебираем все кнопки «Заказать» (если они есть)
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product;
      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }
      orderDialog.showModal();
      disableScroll(); // БЛОКИРУЕМ СКРОЛЛ при открытии
    });
  });

  // Закрываем модальное окно по кнопке «Закрыть»
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });

  // ВАЖНО: Отслеживаем закрытие dialog (через метод close, кнопку Esc или клик на оверлей)
  orderDialog.addEventListener('close', () => {
    enableScroll(); // ВОЗВРАЩАЕМ СКРОЛЛ при любом закрытии
  });
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

/* Добавление базовой обработки формы */
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

// Проверяем, есть ли форма на странице, прежде чем вешать слушатель
if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      orderForm.reportValidity();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
    }

    orderForm.reset();
    
    if (orderDialog) {
      orderDialog.close();
    }
  });
}

/* Кнопка «Наверх» (Scroll-to-top) */
document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  if (scrollToTopBtn) {
    // Показываем кнопку при прокрутке ниже 300px
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopBtn.removeAttribute('hidden');
      } else {
        scrollToTopBtn.setAttribute('hidden', '');
      }
    });

    // Плавный скролл наверх при клике
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});


