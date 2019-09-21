import {Card} from './card';
import {api} from '../index';


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
		const card = new Card(title, link, likes, _id, owner, ownerName);
		this.container.appendChild(card.cardElement);
	}

	/**
	 * асинхронный метод для отрисовки карточек с сервера при загрузке страницы
	 */
	async render() {
		try {
			const result = await api.getInitialCards();
			
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
		const cardsArr = [...this.container.children];
		
		if (document.querySelector('.sort-button').classList.contains('pressed')) {
			cardsArr.sort((card1, card2) => {
				return +card2.querySelector('.place-card__like-counter').textContent - +card1.querySelector('.place-card__like-counter').textContent;
			});
		} else {
			cardsArr.sort((card1, card2) => {
				return +card1.querySelector('.place-card__like-counter').textContent - +card2.querySelector('.place-card__like-counter').textContent;
			});
		}
		
		this.container.innerHTML = '';

		for (let card of cardsArr) {
			this.container.appendChild(card);
		}
	}
}

export {CardList};