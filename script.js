document.addEventListener('DOMContentLoaded', () => {
  const packageCards = document.querySelectorAll('.package-card');
  const packageRadios = document.querySelectorAll('input[name="package"]');
  const addonItems = document.querySelectorAll('.addon-item');
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox');

  const selectedListEl = document.getElementById('selected-list');
  const totalPriceEl = document.getElementById('total-price');
  const totalTimeEl = document.getElementById('total-time');

  // Модальне вікно
  const modal = document.getElementById('order-modal');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const doneModalBtn = document.getElementById('done-modal-btn');

  const modalItemsEl = document.getElementById('modal-items');
  const modalPriceEl = document.getElementById('modal-price');
  const modalTimeEl = document.getElementById('modal-time');

  const formView = document.getElementById('modal-form-view');
  const successView = document.getElementById('modal-success-view');
  const orderForm = document.getElementById('order-form');
  const nameInput = document.getElementById('client-name');
  const tgInput = document.getElementById('client-tg');

  function formatPrice(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₴';
  }

  function formatHours(hours) {
    return `${hours} год`;
  }

  function updateCalculator() {
    let totalPrice = 0;
    let totalHours = 0;
    const selectedItems = [];

    // 1. Активний базовий пакет
    packageRadios.forEach((radio) => {
      const card = radio.closest('.package-card');
      if (radio.checked) {
        card.classList.add('active');
        const price = Number(radio.dataset.price);
        const hours = Number(radio.dataset.hours);
        totalPrice += price;
        totalHours += hours;
        selectedItems.push({ title: radio.dataset.title, price });
      } else {
        card.classList.remove('active');
      }
    });

    // 2. Обрані додаткові опції
    addonCheckboxes.forEach((checkbox) => {
      const item = checkbox.closest('.addon-item');
      if (checkbox.checked) {
        item.classList.add('checked');
        const price = Number(checkbox.dataset.price);
        const hours = Number(checkbox.dataset.hours);
        totalPrice += price;
        totalHours += hours;
        selectedItems.push({ title: checkbox.dataset.title, price });
      } else {
        item.classList.remove('checked');
      }
    });

    // 3. Оновлення списку в блоці підсумку
    selectedListEl.innerHTML = selectedItems
      .map(
        (item) =>
          `<li><span>${item.title}</span><span>${formatPrice(item.price)}</span></li>`
      )
      .join('');

    // 4. Оновлення ціни та часу з легкою анімацією
    totalPriceEl.textContent = formatPrice(totalPrice);
    totalTimeEl.textContent = formatHours(totalHours);

    totalPriceEl.classList.remove('price-bump');
    void totalPriceEl.offsetWidth; // перезапуск анімації
    totalPriceEl.classList.add('price-bump');
    setTimeout(() => totalPriceEl.classList.remove('price-bump'), 200);

    return { selectedItems, totalPrice, totalHours };
  }

  // Слухачі подій для пакетів і чекбоксів
  packageRadios.forEach((radio) => {
    radio.addEventListener('change', updateCalculator);
  });

  addonCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateCalculator);
  });

  // Відкриття модального вікна
  openModalBtn.addEventListener('click', () => {
    const { selectedItems, totalPrice, totalHours } = updateCalculator();

    modalItemsEl.innerHTML = selectedItems
      .map((item) => `<div>• ${item.title} — ${formatPrice(item.price)}</div>`)
      .join('');

    modalPriceEl.textContent = formatPrice(totalPrice);
    modalTimeEl.textContent = formatHours(totalHours);

    // Скидаємо стан форми перед відкриттям
    formView.classList.remove('hidden');
    successView.classList.add('hidden');
    clearValidation();

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  closeModalBtn.addEventListener('click', closeModal);
  doneModalBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Валідація форми
  function clearValidation() {
    [nameInput, tgInput].forEach((input) => {
      input.closest('.form-group').classList.remove('invalid');
    });
  }

  [nameInput, tgInput].forEach((input) => {
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        input.closest('.form-group').classList.remove('invalid');
      }
    });
  });

  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    if (nameInput.value.trim() === '') {
      nameInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    if (tgInput.value.trim() === '') {
      tgInput.closest('.form-group').classList.add('invalid');
      isValid = false;
    }

    if (!isValid) return;

    // Показуємо екран успішної заявки
    formView.classList.add('hidden');
    successView.classList.remove('hidden');
    orderForm.reset();
  });

  // Перший запуск підрахунку при завантаженні
  updateCalculator();
});