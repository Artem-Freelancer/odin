// Объект представления
let view = {
	// Функция для выведения ссобщения сверху
	displayMessage: function(msg) {
		let messageArea = document.getElementById("messagArea");
		messageArea.innerHTML = msg;
	},

	// Функция для обозначения попадания в корабль
	displayHit: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	// Функция для обозначения промаха
	displayMiss: function(location) {
		let cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
}



// Объект модели
let model = {
	boardSize: 7, // размер сетки игрового поля
	numShips: 3,  // количество кораблей в игре
	shipLength: 3, // длина каждого корабля (в клетках).
	shipsSunk: 0, // количество потопленных кораблей.

	// позиции кораблей и координаты попаданий.
	ships: [
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
		{ locations: ["0", "0", "0"], hits: ["", "", ""] },
		{ locations: ["0", "0", "0"], hits: ["", "", ""] }
	],

	// Случайная генерация местоположений кораблей
	// 1) Создаем в модели массив ships с количеством кораблей, определяемым свойством numShips модели
	generateShipLocations: function() {
		let locations;
		for(let i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations)) {
				this.ships[i].locations = locations;
			}
		}
	},
	// 2) Создаем один корабль, находящийся в произвольном месте игрового поля. При этом не исключено перекрытие с другими кораблями
	generateShip: function() {
		let direction = Math.floor(Math.random() * 2);
		let row; 
		let col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - 3));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - 3));
			col = Math.floor(Math.random() * this.boardSize);
		}

		let newShipLocations = [];
		for (let i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i))
			} else {
				newShipLocations.push((row + i) + "" + col)
			}
		}
		return newShipLocations;
	},
	// 3) Получаем один корабль и проверяет, что тот не перекрывается с кораблями, уже находящимися на игровом поле
	collision: function(locations) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = model.ships[i];
			for (let j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	},

	// метод для выполнения выстрела и проверки результата (промах или попадание).
	fire: function(guess) {
		for (let i = 0; i < this.numShips; i++) {
			let ship = this.ships[i];
			let index = ship.locations.indexOf(guess);
			if (ship.hits[index] === "hit") {
				view.displayMessage("К сожалению, вы уже попали в это место!");
				return true;
			} else if (index >= 0){
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("Попал!");
				if (this.isSunk(ship)) {
					view.displayMessage("Ты потопил мой линкор!")
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Ты промахнулся!");
		return false;
	},

	// Метод для получения информации о том, что потоплен корабль или нет
	isSunk: function(ship) {
		for (let i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	}
};

// Объект контроллера
var controller = {
	// Количество выстрелов
	guesses: 0,

	// Метод для обработки координат выстрела и передачи их модели. Проверяет условие завершения игры.
	processGuess: function(guess) {
		let location = parceGuess(guess);
		if (location) {
			this.guesses++;
			let hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("Ты потопил все мои линкоры, в " + this.guesses + " выстрелов");
			}
		}
	}
}

// Функция для преобразоваия формы ("A1", "B3", "C2") в форму ("01", "23", "32")
function parceGuess(guess) {
	let alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Ой, пожалуйста, введите букву и цифру на доске.");
	} else {
		let firstChar = guess.charAt(0);
		let row = alphabet.indexOf(firstChar);
		let column = guess.charAt(1);

		// Проверяем оба символа и узнаём, являются ли они цифрами в диапазоне от 0 до 6
		if (isNaN(row) || isNaN(column)) {
			alert("Ой, этого нет на доске.");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Ой, этого нет на доске.");
		} else {
			return row + column
		}
	}
	return null;
}

// Обработчик событий( кнопка fire)

function init() {
	let fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	let guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton() {
	let guessInput = document.getElementById("guessInput");
	let guess = guessInput.value.toUpperCase();
	controller.processGuess(guess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	let fireButton = document.getElementById("fireButton");
	e = e || window.event;
	if (e.keyCode === 13) {
		fireButton.click()
		return false;
	}
}

window.onload = init;