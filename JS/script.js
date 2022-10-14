const nav = document.querySelector('#header__nav');
const navButton = document.querySelector('#header__button');
const navImage = document.querySelector('#header__img');

navButton.onclick = () => {
	if (nav.classList.toggle('open')) {
		navImage.src = './img/close-button.svg';
	} else {
		navImage.src = './img/open-button.svg';
	}
}


// Photo gallery
function slidesPlugin(activeSlide = 0) {
	const slides = document.querySelectorAll('.slide');

	slides[activeSlide].classList.add('active');

	for (const slide of slides) {
		slide.addEventListener('click', () => {
			clearActiveClasses()

			slide.classList.add('active');
		})
	}

	function clearActiveClasses() {
		slides.forEach((slide) => {
			slide.classList.remove('active');
		})
	}
}

slidesPlugin(1);