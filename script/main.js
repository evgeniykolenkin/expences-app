// Объявление переменных - Строковых констант
const STATUS_IN_LIMIT = "всё хорошо";
const STATUS_OUT_OF_LIMIT = "всё плохо";

// Объявление переменных - ссылок на html элементы

const inputNode = document.querySelector(".js-expenses__input");
const categorySelectNode = document.querySelector(".js-category__select");
const addButtonNode = document.querySelector(".js-expenses__btn-add");
const clearButtonNode = document.querySelector(".js-clear__btn");
const totalValueNode = document.querySelector(".js-expenses__total-value");
const statusNode = document.querySelector(".js-expenses__status");
const historyList = document.querySelector(".js-expenses__history-list");

// Получает лимит из элемента html

const limitNode = document.querySelector(".expenses__limit-value");
const limit = parseInt(limitNode.innerText);
limitNode.className = "rub";

// Объявление нашей основной переменной
// при запуске она содержит в себе пустой массив,
// который мы пополняем по нажатию на кнопку Добавить

let expenses = [];

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
  const total = getTotal(expenses);
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

// функция - обработчик, которая вызывается при нажатии на кнопку Добавить
function addButtonHanler() {
  // сохраняем в переменную currentAmount введенную сумму
  const currentAmount = getExpenseFromUser();
  if (!currentAmount) {
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
  // и categoty(currentCategory)
  const newExpense = { amount: currentAmount, category: currentCategory };

  // Добавляем новый расход в массив расходов
  expenses.push(newExpense);

  // переписываем интерфейс
  render();

  // сбрасываем введенную сумму
  clearInput(inputNode);
}

// функция-обработчик кнопки Сбросить расходы
function clearButtonHandler() {
  expenses = [];
  render();
}

// привязка функци-обработчиков к кнопкам
addButtonNode.addEventListener("click", addButtonHanler);
clearButtonNode.addEventListener("click", clearButtonHandler);
