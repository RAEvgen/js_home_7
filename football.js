(function (global) { //модуль проектирования
    'use strict';    


    function randomInt(min, max) {  //функция установки случайного числа и присвоения 
        if (arguments.length < 2) { //минимума максимуму
            max = min;
            min = 0;
        }
        return Math.floor(Math.random() * (max - min + 1)) + min; // возвращение целой части
    }                                                             // случайного числа


    function Person(firstname, lastname) {  //конструктор объекта
        this.firstname = firstname;         //присвоение значения по умолчанию.this-указание
        this.lastname = lastname;           //на контекст - текущий объект
    }

    Person.prototype.getFullName = function () {  // прототип для хранения методов объекта
        return this.firstname + ' ' + this.lastname; //функция складывает имя и фамилию 
    };                                               //добавляя пробел

    
    function Fan(firstname, lastname) {        //конструктор объекта - фанат
        Person.call(this, firstname, lastname); //вызываем родительский конструктор персоны
    }                                           
                                                

    Fan.prototype = Object.create(Person.prototype);  //Фанат наследует метод объекта Персона
    Fan.prototype.constructor = Fan;                  //

    Fan.prototype.onGoal = function () {   //реакция фаната при забивани гола в чужие ворота
        var reaction = ['скандирует речевку', 'палит фаер', 'машет флагом'],
            i = randomInt(reaction.length - 1);
        return this.getFullName() + ' ' + reaction[i];
    };

    Fan.prototype.onFail = function () { //реакция фаната при забивани гола в свои ворота
        var reaction = ['хватается за голову', 'кричит судью на мыло', 'зачиняет драку'],
            i = randomInt(reaction.length - 1);
        return this.getFullName() + ' ' + reaction[i];
    };


    function Footballer(firstname, lastname) { //конструктор объекта - футболист
        Person.call(this, firstname, lastname); //вызываем родительский конструктор персоны
    }

    Footballer.prototype = Object.create(Person.prototype); //футболист наследует метод 
    Footballer.prototype.constructor = Footballer;          //объекта персона

    Footballer.prototype.goal = function () {   //собственный метод футболиста
        this.team.goals += 1;                   
    };


    function Team(name) {     //конструктор объекта - команда
        this.name = name;     //указание параметров по умолчанию
        this.footballers = []; //укладывает футболистов 
        this.fans = [];        //и фанатов в массив
        this.goals = 0;        //обнуляет голы
    }

    Team.prototype.addFootballer = function (footballer) {   //прототип объекта команда
        this.footballers.push(footballer);    //добавляет футболистов 
        footballer.team = this;               //в объект команда
    };

    Team.prototype.addFan = function (fan) { //2-й прототип объекта команда
        this.fans.push(fan);                 //добавляет фанатов в команду
        fan.team = this;
    };


    function Scoreboard(elemId, team1, team2) { //конструктор объекта табло
        this.elem = document.getElementById(elemId); //динамически создаем элемент на странице
        this.elem.classList.add('scoreboard'); //добавляем ему css свойства(стили)
        this.elem.innerHTML = '\
            <div>\
                <div class="team"></div>\
                <div class="score">\
                    <span>0</span>\
                    <span>:</span>\
                    <span>0</span>\
                </div>\
                <div class="team"></div>\
            </div>\
            <div class="messages"></div>' //добавляем в html спаны счётчика табло

        this.messages = this.elem.querySelector('.messages');
        this.team1Score = this.elem.querySelector('.score span:first-child');
        this.team2Score = this.elem.querySelector('.score span:last-child');

        this.elem.querySelector('.team:first-child').appendChild(document.createTextNode(team1.name));
        this.elem.querySelector('.team:last-child').appendChild(document.createTextNode(team2.name));

        this.team1 = team1;
        this.team2 = team2;
    }

    Scoreboard.prototype.showMessage = function (msg) { //прототип объекта табло
        var p = document.createElement('p');            //создание абзаца
        p.appendChild(document.createTextNode(msg));    //вкладывание абзаца в сообщение

        this.messages.insertBefore(p, this.messages.firstChild );
    };

    Scoreboard.prototype.updateScore = function () { //2-й прототип объекта табло
        this.team1Score.replaceChild(
            document.createTextNode(team1.goals),
            this.team1Score.firstChild
        );

        this.team2Score.replaceChild(
            document.createTextNode(team2.goals),
            this.team2Score.firstChild
        );
    };


    function Game(elemId, team1, team2) { //конструктор объекта игра
        this.team1 = team1;               //задание параметров по умочанию
        this.team2 = team2;
        this.scoreboard = new Scoreboard(elemId, team1, team2);
    }

    Game.prototype.start = function (matchTime) { //прототип игры
        var that = this;

        matchTime = matchTime || 10;
        //ниже - сам процесс игры
        function timeout() {  //метод объекта игра 
            var team = randomInt(1) ? that.team1 : that.team2,
                opponents = team === that.team1 ? that.team2 : that.team1,
                footballer = team.footballers[randomInt(team.footballers.length - 1)],
                success = randomInt(1),
                i,
                msg;

            if (success) {
                footballer.goal();
                that.scoreboard.showMessage(footballer.getFullName() + ' забил гол!');
            }

            i = team.fans.length;

            while (i--) { //пока i > 0 выводится сообщение
                msg = success ? team.fans[i].onGoal() : team.fans[i].onFail();
                that.scoreboard.showMessage(msg);
            }

            i = opponents.fans.length;

            while (i--) { //пока i > 0 выводится сообщение
                msg = success ? opponents.fans[i].onFail() : opponents.fans[i].onGoal();
                that.scoreboard.showMessage(msg);
            }

            that.scoreboard.updateScore();

            matchTime -= 1;
            
            if (matchTime) {
                setTimeout(timeout, 1000);
            }
        }
        
        setTimeout(timeout, 1000);
    };


    var team1, team2, //происходит создание объектов игры
        footballer1, footballer2, footballer3, footballer4,
        fan1, fan2, fan3, fan4,
        game;

    team1 = new Team('Питерские Гризли'); //создание двух команд
    team2 = new Team('Гламурные Ёжики');

    footballer1 = new Footballer('Дмитрий', 'Иванов'); //заполнение команд игроками
    footballer2 = new Footballer('Михаил', 'Иванов');
    footballer3 = new Footballer('Игорь', 'Смирнов');
    footballer4 = new Footballer('Юрий', 'Васильев');

    fan1 = new Fan('Кирилл', 'Версетти'); //заполнение команд фанатами
    fan2 = new Fan('Виталий', 'Чертков');
    fan3 = new Fan('Дарья', 'Буртова');
    fan4 = new Fan('Сергей', 'Хоружа');

    team1.addFootballer(footballer1);//добавляем игроков в команду
    team1.addFootballer(footballer2);
    team1.addFan(fan1);//добавляем фанатов в команду
    team1.addFan(fan2);
    //тоже самое со второй командой(добаление игроков и фанатов)
    team2.addFootballer(footballer3);
    team2.addFootballer(footballer4);
    team2.addFan(fan3);
    team2.addFan(fan4);

    game = new Game('football-wrapper', team1, team2); //загружаем команды в игру
    game.start(); //запусукаем игру
}());