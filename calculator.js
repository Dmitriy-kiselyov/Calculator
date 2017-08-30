function Calculator() {

    var currentValue = "0"; //текущее значение калькулятора (отображается на дисплее)
    var savedValue = "0"; //промежуточное значение
    var signMinus = false; //true - число отрицательное
    var currentOperation = null; //символ текущей операции
    var resetOnNumberPressed = false; //если после нажатия кнопки "=" пользователь нажимает цифру, дисплей сбрасывается до 0

    var highlightElement = null; //подсвеченный элемент

    var rootElement = null; //Корневой жлемент калькулятора, на него вешаются обработчики событий, его возвращает калькулятор
    var displayElement = null; //Дисплей калькулятора, часто используется в коде

    //Возвращает корень калькулятора
    function getElement() {
        if (!rootElement)
            buildCalendar(); //Если калькулятор еще не построен
        return rootElement;
    }

    //Создает DOM калькулятора
    function buildCalendar() {
        var calc = $("<div>").addClass("calc");

        //вспомагательная функция, создает кноку, сокращяет код
        function makeButton(text, className) {
            return $("<button>").addClass(className).html(text);
        }

        function makeCell() {
            return $("<div>").addClass("calc_cell");
        }

        //Дисплей
        var row = $("<div>").addClass("calc_row");
        var display = $("<textarea>").addClass("calc_display").attr("rows", "1").attr("disabled", "true").text("0");
        calc.append(row.append(display));

        //Первый ряд кнопок
        row = $("<div>").addClass("calc_row");
        row.append(makeCell().addClass("calc_cell-2").append(makeButton("C", "calc_clear")));
        row.append(makeCell().append(makeButton("&plusmn", "calc_sign")));
        row.append(makeCell().append(makeButton("&#x232B;", "calc_backspace")));
        calc.append(row);

        //Второй ряд кнопок
        row = $("<div>").addClass("calc_row");
        row.append(makeCell().append(makeButton(7, "calc_numeric")));
        row.append(makeCell().append(makeButton(8, "calc_numeric")));
        row.append(makeCell().append(makeButton(9, "calc_numeric")));
        row.append(makeCell().append(makeButton("&divide;", "calc_operation").val("/")));
        calc.append(row);

        //Третий ряд кнопок
        row = $("<div>").addClass("calc_row");
        row.append(makeCell().append(makeButton(4, "calc_numeric")));
        row.append(makeCell().append(makeButton(5, "calc_numeric")));
        row.append(makeCell().append(makeButton(6, "calc_numeric")));
        row.append(makeCell().append(makeButton("&#10005;", "calc_operation").val("*")));
        calc.append(row);

        //Четвертый ряд кнопок
        row = $("<div>").addClass("calc_row");
        row.append(makeCell().append(makeButton(1, "calc_numeric")));
        row.append(makeCell().append(makeButton(2, "calc_numeric")));
        row.append(makeCell().append(makeButton(3, "calc_numeric")));
        row.append(makeCell().append(makeButton("&#8722;", "calc_operation").val("-")));
        calc.append(row);

        //Пятый ряд кнопок
        row = $("<div>").addClass("calc_row");
        row.append(makeCell().addClass("calc_cell-2").append(makeButton(0, "calc_numeric")));
        row.append(makeCell().append(makeButton("=", "calc_equals")));
        row.append(makeCell().append(makeButton("+", "calc_operation").val("+")));
        calc.append(row);

        //обработка событий калькулятора
        calc.click(function (event) {
            var className = event.target.className; //будем различать тип элемента по классу
            switch (className) {
                case "calc_clear": //нажата кнопка С
                    reset();
                    break;
                case "calc_sign": //нажата кнопка +-
                    signChange();
                    break;
                case "calc_numeric": //нажата цифровая кнопка
                    numPressed(+event.target.textContent);
                    break;
                case "calc_backspace": //нажата кнока стереть
                    backspace();
                    break;
                case "calc_operation": //нажата кнопка с операцией
                    operation(event.target.value);
                    highlight($(event.target));
                    break;
                case "calc_equals": //нажата кнопка =
                    calculate();
            }
        });

        rootElement = calc;
        displayElement = display;
    }


    function display() { //вспомагательная функция, обновляет дисплей
        displayElement.html(signMinus ? "-" + currentValue : currentValue);
    }

    function numPressed(num) { //при нажатии на цифровую кнопку
        if (resetOnNumberPressed) { //если после нажатия кнопки "=" пользователь нажимает цифру, дисплей сбрасывается до 0
            reset();
            resetOnNumberPressed = false;
        }

        //дописываем к текущему значению нажатую цифру
        if (currentValue == "0")
            currentValue = String(num);
        else
            currentValue += num;
        display();
    }

    function reset() { //сброс
        currentValue = "0";
        savedValue = "0";
        signMinus = false;
        resetHighlight();
        display();
    }

    function signChange() { //смена знака
        if (currentValue == "0") //для 0 знак не меняется
            return;

        signMinus = !signMinus; //смена знака
        display();
    }

    function operation(op) { //операция + - / *
        if (currentOperation != null) //если в памяти есть какая-то незавершенная операция
            calculate(); //нужно ее выполнить и обновить значение
        resetOnNumberPressed = false;

        //запоминает текущее значение в промежуточный результат
        savedValue = signMinus ? "-" + currentValue : currentValue;
        currentValue = 0;
        signMinus = false;
        currentOperation = op;
        display();
    }

    function calculate() { //выполнить подсчет операции, вспомогательная функция
        if (currentOperation == null) //операции нет
            return;

        currentValue = signMinus ? "-" + currentValue : currentValue;
        currentValue = String(eval(savedValue + currentOperation + currentValue)); //вычисляет значение

        currentOperation = null;
        savedValue = 0;
        signMinus = false;
        resetOnNumberPressed = true;

        if (currentValue[0] == '-') { //если число отрицательное
            currentValue = currentValue.substring(1);
            signMinus = true; //ХРАНИМ ЗНАК ТОЛЬКО В ЭТОЙ ПЕРЕМЕННОЙ (чтобы избежать множества глупых ошибок)
        }

        resetHighlight(); //операция выполнена, сбрасываем подсветку операций
        display();
    }

    function backspace() { //удалить символ
        if (resetOnNumberPressed) { //если после нажатия кнопки "=" пользователь нажимает "стереть", дисплей сбрасывается до 0
            reset();
            return;
        }

        if (currentValue.length === 1) { //если введен только один символ
            currentValue = "0"; //обнуляем
            signMinus = false;
        } else
            currentValue = currentValue.substring(0, currentValue.length - 1); //иначе стираем последний
        display();
    }

    function highlight(element) { //выделить кнопку с этим id в голубой цвет
        resetHighlight(); //сначала убираем подсветку с другой кнопки

        element.css("backgroundColor", "lightblue");
        highlightElement = element; //запоминает подсвеченную кнопку
    }

    function resetHighlight() { //очистка подсветки, вспомогательная функция
        if (highlightElement)
            highlightElement.css("backgroundColor", "");
    }

    //делаем функцию, возвращающую корневой элемент калькулятора, публичной
    this.getElement = getElement;

}