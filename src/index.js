import "./style.css";

import {Api} from './js/api';
import {CardList} from './js/cardList';
import {Form} from './js/form';
import {User} from './js/user';

const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort2' : 'https://praktikum.tk/cohort2';

// создаем новый объект api с заданными параметрами доступа к серверу
export const api = new Api({
	baseUrl: serverUrl,
	headers: {
		authorization: '7858cecb-8a25-4aa6-9e6c-4b58c7960d56',
		contentType: 'application/json'
	}
});

// создаем пользователя через конструктор соответствующего класса
const user = new User();

// создаем новый контейнер для карточек через конструктор
const placesListEl = new CardList(document.querySelector('.places-list'));


// обработчик на кнопку сортировки карточек
document.querySelector('.sort-button').addEventListener('click', function() {
	document.querySelector('.sort-button').classList.toggle('pressed');
	document.querySelector('.sort-button').blur();
	placesListEl.sortCards();
});

// обработчик на кнопку добавления новой карточки
document.querySelector('.user-info__button').addEventListener('click', function(event) {
	// вызываем конструктор форм
	const form = new Form(event);
});

// вешаем обработчик на кнопку редактирования профиля
document.querySelector('.user-info__edit-button').addEventListener('click', function(event) {
	// вызываем конструктор форм
	const form = new Form(event);
});

// вешаем обработчик на аватарку
document.querySelector('.user-info__photo').addEventListener('click', function(event) {
	// вызываем конструктор форм
	const form = new Form(event);
});

/**
 * Отличная работа
 * 
 * README.md - надо дооформить. README.md должно быть расписано "как запустить проект, пошагово", что из себя представляет проект.
 * Представьте, что вы отдадите свой проект своему другу через 5 лет и вы должны рассказать что и за чем он, какую несёт цель и так далее
 * 
 */