# Calculator
Самый обыкновенный javascript-калькулятор. Тут и добавить, собственно, нечего.

![Imgur](https://i.imgur.com/Z2eqdf8.png)

Я его написал, так как прочитал про единицу измерения __em__ и мне стало интересно
попрактиковать ее применение на реальной задаче.
Размер калькулятора меняется автоматически, так как все единицы указаны в __em__.

Преимущество такого подхода в том, что масштабировать калькулятор можно всего
одной командой в _html_, выставив нужный стиль
`style = "font-size = _ px"`.
Таким образом, человеку даже не нужно использовать _javascript_.

Все остальные виджеты (__календарь__ и __сапёр__) используют этот же подход,
принимая за единицу измерения (__1em__) строителный блок (ячейку, кнопку и т.д.).
