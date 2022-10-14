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

