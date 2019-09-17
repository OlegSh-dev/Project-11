//ОТ АВТОРА:
// Дополнил задания еще одним: сделал всплывающую подсказку при наведении мыши на количество лайков карточки,
// там отображаются все пользователи, которые поставили лайк. Прошу оценить это решение тоже)


'use strict';

// создаем новый объект api с заданными параметрами доступа к серверу
const api = new Api({
	baseUrl: 'http://95.216.175.5/cohort2',
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