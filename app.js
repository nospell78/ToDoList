const todoValue = document.getElementById("todoText"), // переменная для ввода данных
      listItems = document.getElementById("list-items"), // переменная для списка данных
      addUpdateClick = document.getElementById("AddUpdateClick"); // переменная для кнопки добавления задачи

let updateText;
let todoData = JSON.parse(localStorage.getItem("todoData")) || []; // Загружаем данные из localStorage или инициализируем пустой массив

// Обработчик события для ввода
todoValue.addEventListener("keyup", function(e) {
    if(e.key === "Enter") { // Если нажата клавиша Enter
        addUpdateClick.click(); // Имитируем клик по кнопке добавления
    } 
});

// Загружаем и отображаем задачи при загрузке страницы
ReadToDoItems();

function ReadToDoItems() {
    console.log(todoData);
    listItems.innerHTML = ""; // Очищаем список перед добавлением элементов
    todoData.forEach(element => {
        let li = document.createElement("li");
        let style = element.status ? "text-decoration: line-through;" : ""; // Установка стиля в зависимости от статуса
        const todoItems = `
            <div style="${style}" onclick="CompleteTodoItems(this)">${element.item}</div>
            <div>
                <img class="perform todo-controls" src="perform.png" onclick="CompleteTodoItems(this)"/>
                <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="pencil.png"/>
                <img class="delete todo-controls" onclick="DeleteTodoItems(this)" src="delete.png"/>
            </div>`;
        li.innerHTML = todoItems; // Добавляем HTML содержимое
        listItems.appendChild(li); // Добавляем элемент списка на страницу
    });
}

function CreateToDoData() { // Функция по созданию данных списка дел
    if(todoValue.value === "") { // Если значение пустое
        alert("Пожалуйста введите текст в список"); // Предупреждение
        todoValue.focus(); // Фокус на поле ввода
        return; // Прерываем выполнение
    }

    let dataItems = { item: todoValue.value, status: false }; // Создаем новый объект задачи
    todoData.push(dataItems); // Добавляем задачу в массив
    localStorage.setItem("todoData", JSON.stringify(todoData)); // Сохраняем массив в localStorage
    ReadToDoItems(); // Обновляем список на странице
    todoValue.value = ""; // Очищаем поле ввода
}

function CompleteTodoItems(e) { // Функция для завершения задачи
    let itemDiv = e.parentElement.parentElement.querySelector("div");
    if (itemDiv.style.textDecoration === "") {
        itemDiv.style.textDecoration = "line-through"; // Зачеркиваем текст
        todoData.forEach((element) => {
            if (element.item === itemDiv.innerText.trim()) {
                element.status = true; // Обновляем статус задачи
            }
        });
    } else {
        itemDiv.style.textDecoration = ""; // Убираем зачеркивание
        todoData.forEach((element) => {
            if (element.item === itemDiv.innerText.trim()) {
                element.status = false; // Обновляем статус задачи
            }
        });
    }
    localStorage.setItem("todoData", JSON.stringify(todoData)); // Сохраняем изменения в localStorage
}

function UpdateToDoItems(e) { // Функция для изменения задачи
    let itemDiv = e.parentElement.parentElement.querySelector("div");
    if (itemDiv.style.textDecoration === "") {
        todoValue.value = itemDiv.innerText; // Загружаем текст задачи в поле ввода
        addUpdateClick.onclick = function() { UpdateOnSelectionItems(itemDiv); }; // Устанавливаем функцию обновления
        addUpdateClick.setAttribute("src", "refresh.png"); // Меняем изображение на иконку обновления
        updateText = itemDiv; // Сохраняем элемент для обновления
    }   
}

function UpdateOnSelectionItems(itemDiv) {
    const originalText = itemDiv.innerText.trim(); // Сохраняем оригинальный текст перед изменением
    itemDiv.innerText = todoValue.value; // Обновляем текст задачи

    todoData.forEach((element) => {
        if (element.item === originalText) { // Ищем элемент по оригинальному тексту
            element.item = todoValue.value; // Обновляем текст задачи в массиве
        }
    });

    localStorage.setItem("todoData", JSON.stringify(todoData)); // Сохраняем изменения в localStorage
    todoValue.value = ""; // Очищаем поле ввода
    addUpdateClick.setAttribute("onclick", "CreateToDoData()"); // Возвращаем кнопку в режим добавления
    addUpdateClick.setAttribute("src", "plus.png");   
}

function DeleteTodoItems(e) { // Функция для удаления задачи
    let deleteValue = e.parentElement.parentElement.querySelector("div").innerText;
    if (confirm(`Вы действительно хотите удалить это задание: ${deleteValue}?`)) {
        todoData = todoData.filter(item => item.item !== deleteValue); // Удаляем задачу из массива
        localStorage.setItem("todoData", JSON.stringify(todoData)); // Сохраняем обновленный массив в localStorage
        ReadToDoItems(); // Обновляем список на странице
    }
}
