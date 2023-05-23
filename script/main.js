// Объявление переменных - Строковых констант
const STATUS_IN_LIMIT = "всё хорошо";
const STATUS_OUT_OF_LIMIT = "всё плохо";
const CHANGE_LIMIT_VALUE = "Новый лимит";
const STORAGE_LIMIT = "limit";
const STORAGE_EXPENSES = "expenses";

// Объявление переменных - ссылок на html элементы

const inputNode = document.querySelector(".js-expenses__input");
const categorySelectNode = document.querySelector(".js-category__select");
const addButtonNode = document.querySelector(".js-expenses__add-btn");
const clearButtonNode = document.querySelector(".js-expenses__clear-btn");
const changeLimitButtonNode = document.querySelector(".js-change__limit-btn");
const totalValueNode = document.querySelector(".js-expenses__total-value");
const statusNode = document.querySelector(".js-expenses__status");
const historyList = document.querySelector(".js-expenses__history-list");

// Получает лимит из элемента html
// если есть данные в Storage, берём их оттуда
const limitNode = document.querySelector(".expenses__limit-value");
let limit = parseInt(limitNode.innerText);
limitNode.className = "rub";

function initLimit() {
  const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LIMIT));
  if (!limitFromStorage) {
    return;
  }
  limitNode.innerText = limitFromStorage;
  limit = parseInt(limitNode.innerText);
}

initLimit();

// Объявление нашей основной переменной
// при запуске она содержит в себе пустой массив,
// который мы пополняем по нажатию на кнопку Добавить
// если есть данные в Storage, берём их оттуда
let expenses = [];

function initExpenses() {
  const expensesFromStorageString = localStorage.getItem(STORAGE_EXPENSES);
  const expensesFromStorage = JSON.parse(expensesFromStorageString);

  if (Array.isArray(expensesFromStorage)) {
    expenses = expensesFromStorage;
  }
  render();
}

initExpenses();

// -----------------ФУНКЦИИ--------------------

// подсчитывает и возвращает сумму всех трат

function getTotal() {
  let sum = 0;
  expenses.forEach(function (expense) {
    // пробегаем по массиву объектов expense, берем из каждого поле amount
    // и прибавляем к переменной sum
    sum += expense.amount;
  });

  return sum;
}

// Отрисовываем/обнрвляем строки всего, лимит и статус

function renderStatus() {
  // создаем переменную total и записываем в нее результат выполнения getTotal
  const total = getTotal();
  totalValueNode.innerText = total;
  totalValueNode.className = "rub";

  // условие сравнение - что больше? всего или лимит
  if (total <= limit) {
    statusNode.innerText = STATUS_IN_LIMIT;
    statusNode.className = "status__approved";
  } else {
    // шаблонная строка - строка, в которую можно вставить переменные и выражения
    statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${limit - total} руб.)`;
    statusNode.className = "status__rejected";
  }
}

// Отрисовываем/обнолвяем блок с историей

function renderHistory() {
  historyList.innerHTML = "";
  // цикл по массиву expenses, где каждый элемент - запись о расходе (сумма и категория)
  // cокращенная запись, как вариант:
  // expenses.forEach((expense) => {}
  expenses.forEach(function (expense) {
    // coздание элемента li(он пока только в памяти создан)
    const histotyItem = document.createElement("li");
    histotyItem.className = "rub";

    // Шаблонная строка категория - сумма
    histotyItem.innerText = `${expense.category} - ${expense.amount}`;

    // вставляем li из памяти в конец списка истории
    historyList.appendChild(histotyItem);
  });
}

// Отрисовываем/обновляем всё(историю, всего, статус)

function render() {
  // вызов функций обновления статуса, всего и истории
  renderStatus();
  renderHistory();
}

// Вовращает введенную пользователем сумму
function getExpenseFromUser() {
  return parseInt(inputNode.value);
}

// Возвращает выбранную категорию
function getSelectedCategory() {
  return categorySelectNode.value;
}

// функция очистки поля ввода суммы
// 1. вариант с объявлением функции
// function clearInput(input) {
//   input.value = "";
// }

// 2. вариант с объявлением переменной и присвоением ей функции
// const clearInput = function(input) {
//   inputNode.value = "";
// }

// 3. вариант со стрелочной функцией(самый популярный)
const clearInput = (input) => {
  inputNode.value = "";
};

function saveExpensesToStorage() {
  const expensesString = JSON.stringify(expenses);
  localStorage.setItem(STORAGE_EXPENSES, expensesString);
}

// функция - обработчик, которая вызывается при нажатии на кнопку Добавить
function addButtonHandler() {
  // сохраняем в переменную currentAmount введенную сумму
  const currentAmount = getExpenseFromUser();
  if (!currentAmount) {
    alert("Трата отсутствует");
    return;
  }

  // сохраняем в переменную currentCategory выбранную категорию
  const currentCategory = getSelectedCategory();
  // если категория равна знаению Категория, то произойдет выход из функции
  if (currentCategory === "Категория") {
    alert("Категория не выбрана");
    return;
  }

  // из полученных переменных собираем объект newExpense
  // который состоит мз двух полей - amount(currentAmount)
  // и category(currentCategory)
  const newExpense = { amount: currentAmount, category: currentCategory };

  // Добавляем новый расход в массив расходов
  expenses.push(newExpense);
  saveExpensesToStorage();

  // переписываем интерфейс
  render();

  // сбрасываем введенную сумму
  clearInput(inputNode);
}

// функция-обработчик кнопки Сбросить расходы
function clearButtonHandler() {
  expenses = [];
  localStorage.removeItem(STORAGE_EXPENSES);
  render();
}

// функция-обработчик(хендлер) кнопки изменения лимита
function changeLimitHandler() {
  // в переменную newLimit мы записываем результат изменения функции prompt,
  // которой передаём параметр "новый лимит"
  // prompt вызывает встроенную в браузер модалку с импутом
  // а возвращает то, что ввёл в импут пользователь
  const newLimit = prompt(CHANGE_LIMIT_VALUE);
  const newLimitValue = parseInt(newLimit);

  if (!newLimitValue) {
    alert("Лимит должен быть числом");
    return;
  }

  // прописываем в html новое значение лимита
  limitNode.innerText = newLimitValue;
  // а также прописываем это значение в нашу переменную с лимитом
  limit = newLimitValue;
  localStorage.setItem(STORAGE_LIMIT, newLimitValue);

  // обновляем интерфейс
  render();
}

// привязка функци-обработчиков к кнопкам
addButtonNode.addEventListener("click", addButtonHandler);
clearButtonNode.addEventListener("click", clearButtonHandler);
changeLimitButtonNode.addEventListener("click", changeLimitHandler);
