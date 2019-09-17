'use strict';

/**
 * класс для создания контейнера с карточками на странице
 */
class CardList {
	/**
	 * @param {HTMLElement} container - контейнер для размещения элементов
	 */
	constructor(container) {
		this.container = container;
		this.render();
	}

	/**
	 * метод для отрисовки новой карточки на странице
	 * @param {string} title - заголовок карточки
	 * @param {string} link - ссылка на изображение для карточки
	 * @param {Array} likes - массив с именами пользователей, которые поставили лайк на карточке
	 * @param {string} _id - идентификатор карточки
	 * @param {string} owner - идентификатор владелеца карточки
	 * @param {string} ownerName - имя владельца карточки
	 */
	addCard(title, link, likes, _id, owner, ownerName) {
		// вызываем конструктор карточек
		const card = new Card(title, link, likes, _id, owner, ownerName);
		this.container.appendChild(card.cardElement);
	}

	/**
	 * асинхронный метод для отрисовки карточек с сервера при загрузке страницы
	 */
	async render() {
		try {
			// делаем запрос на сервер через класс api
			const result = await api.getInitialCards();
			
			// достаем из объекта необходимые данные и вызываем для каждого объекта метод отрисовки новой карточки
			for (let card of result) {
				this.addCard(card.name, card.link, card.likes, card._id, card.owner._id, card.owner.name);
			}
		} catch(err) {
			console.error(`Ошибка загрузки данных карточек: ${err}`);
		}
	}

	/**
	 * метод для сортировки карточек по количеству лайков
	 */
	sortCards() {
		// делаем полноценный массив из дочерних элементов контейнера
		const cardsArr = [...this.container.children];
		
		// сортируем в зависимости от нажатия кнопки
		if (document.querySelector('.sort-button').classList.contains('pressed')) {
			cardsArr.sort((card1, card2) => {
				return +card2.querySelector('.place-card__like-counter').textContent - +card1.querySelector('.place-card__like-counter').textContent;
			});
		} else {
			cardsArr.sort((card1, card2) => {
				return +card1.querySelector('.place-card__like-counter').textContent - +card2.querySelector('.place-card__like-counter').textContent;
			});
		}
		
		// очищаем контейнер
		this.container.innerHTML = '';

		// вставляем в контейнер карточки в отсортированном виде
		for (let card of cardsArr) {
			this.container.appendChild(card);
		}
	}
}
