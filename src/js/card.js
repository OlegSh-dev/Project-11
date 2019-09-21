import {api} from '../index';
import {Popup} from './popup';
import {closeIcon as closeIcon2} from './form';

/**
 * класс для использования в качестве конструктора при создании карточек
 */
class Card {
	constructor(title, link, likes = [], _id = '', owner = '', ownerName = '') {
		this.cardElement = this.create(title, link, likes, _id, owner);
		this.ownerName = ownerName;

		// создаем массив со всеми именами пользователей, которые лайкнули карточку
		this.likes = [];
		this.likesID = [];
		for (let like of likes) {
			this.likes.push(like.name);
			this.likesID.push(like._id)
		}

		this.checkOwner();
		this.checkUserLike();
		this.addListeners();
	}

	/**
	 * метод возвращает элемент для вставки его в DOM
	 * @param {string} title - заголовок карточки
	 * @param {string} link - ссылка на изображение для карточки
	 * @param {Array} likes - массив пользователей, поставивших лайк на карточке
	 * @param {string} _id - идентификатор карточки
	 * @param {string} owner - владелец карточки
	 */
	create(title, link, likes, _id, owner) {
		const stringHTML = `<div class="place-card__image" style="background-image: url('${link}')">
				<button class="place-card__delete-icon"></button>
			</div>
			<div class="place-card__description">
				<h3 class="place-card__name">${title}</h3>
				<div class="place-card__like">
					<button class="place-card__like-icon"></button>
					<p class="place-card__like-counter">${likes.length}</p>
					<div class="tooltip"></div>
				</div>
			</div>`.trim();
		
		const template = document.createElement('div');
		template.classList.add('place-card');
		template.setAttribute('data-_id', _id);
		template.setAttribute('data-owner', owner);

		template.insertAdjacentHTML('afterbegin', stringHTML);

		return template;
	}

	/**
	 * метод для установки различных наблюдателей
	 */
	addListeners() {
		this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like.bind(this));
		this.cardElement.querySelector('.place-card__image').addEventListener('click', this.openImage);

		this.cardElement.querySelector('.place-card__description').addEventListener('mousemove', this.showTooltip.bind(this));
		this.cardElement.querySelector('.place-card__description').addEventListener('mouseout', this.hideTooltip.bind(this));
	}

	/**
	 * метод проверки, есть ли среди лайкнувших карточку текущий пользователь, если да, то закрашиваем сердечко
	 */
	checkUserLike() {
		if (this.likesID.includes(document.querySelector('.user-info__name').dataset.user_id)) {
			this.cardElement.querySelector('.place-card__like-icon').classList.add('place-card__like-icon_liked');
		}
	}

	/**
	 * метод отображения иконки удаления карточки только при условии, пользователь является владельцем карточки
	 */
	checkOwner() {
		if (this.cardElement.dataset.owner === document.querySelector('.user-info__name').dataset.user_id || this.cardElement.dataset.owner === '') {
			this.cardElement.querySelector('.place-card__delete-icon').style.display = 'block';
			this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove.bind(this));
		}
	}

	/**
	 * метод для смены стиля иконки лайк при нажатии на нее
	 */
	like() {
		if (!this.cardElement.querySelector('.place-card__like-icon').classList.contains('place-card__like-icon_liked')) {

			// по принципу Optimistic UI сначала закрашиваем сердечко и увеличиваем счетчик лайков на клиенте
			this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
			this.cardElement.querySelector('.place-card__like-counter').textContent = +this.cardElement.querySelector('.place-card__like-counter').textContent + 1;

			this.likes.push(document.querySelector('.user-info__name').textContent);

			api.doLike(this.cardElement.dataset._id)
				.then(card => this.cardElement.querySelector('.place-card__like-counter').textContent = card.likes.length)
				.catch(err => { 
					console.error(`Ошибка регистрации лайка: ${err}`);
					this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
					this.cardElement.querySelector('.place-card__like-counter').textContent = +this.cardElement.querySelector('.place-card__like-counter').textContent - 1;
				});
		} else {
			api.removeLike(this.cardElement.dataset._id)
				.then(card => this.cardElement.querySelector('.place-card__like-counter').textContent = card.likes.length)
				.then(() => this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked'))
				.then(() => this.likes.splice(this.likes.indexOf(document.querySelector('.user-info__name').textContent), 1))
				.catch(err => {
					this.likes.pop();
					console.error(`Ошибка регистрации лайка: ${err}`);
				});
		}
	}

	/**
	 * метод для удаления карточки
	 */
	remove() {
		if (confirm('Вы действительно хотите удалить эту карточку?')) {
			api.deleteCard(this.cardElement.dataset._id)
				.then(() => this.cardElement.remove())
				.catch(err => console.error(`Ошибка удаления карточки: ${err}`));
		}
	}

	/**
	 * метод для открытия попапа с картинкой из карточки
	 * @param {Object} event 
	 */
	openImage(event) {
		if (event.target.classList.contains('place-card__image')) {
			const popup = new Popup(document.querySelector('.root'));

			const closeIcon = `<img src=${closeIcon2} alt="" class="popup__close">`;

			const imgContainer = document.createElement('div');
			const img = document.createElement('img');

			img.setAttribute('src', event.target.style.backgroundImage.slice(5, -2));
			img.classList.add('popup__img');

			imgContainer.classList.add('popup__image-container');

			imgContainer.addEventListener('click', Popup.close);

			imgContainer.appendChild(img);
			imgContainer.insertAdjacentHTML('afterbegin', closeIcon.trim());
	
			popup.popupElement.appendChild(imgContainer);
			popup.popupElement.classList.add('popup_is-opened');
		}
	}

	/**
	 * метод для отображения всплывающей подсказки с именами пользователей, которые лайкнули эту карточку
	 */
	showTooltip() {
		const tooltip = this.cardElement.querySelector('.tooltip');

		if (event.target.classList.contains('place-card__like-counter')) {
			if (this.likes.length === 0) {
				return;
			} else {
				tooltip.textContent = this.likes.join(', ');
			}	
		} else if (event.target.classList.contains('place-card__like-icon')) {
			return;
		} else {
			tooltip.textContent = this.ownerName || document.querySelector('.user-info__name').textContent;
		}

		tooltip.style.top = `${event.pageY + 10}px`;
		tooltip.style.left = `${event.pageX + 10}px`;
		tooltip.style.display = 'block';
	}

	/**
	 * метод для скрытия всплывающей подсказки
	 */
	hideTooltip() {
		const tooltip = this.cardElement.querySelector('.tooltip');

		tooltip.style.display = 'none';
		tooltip.textContent = '';
	}

}

export {Card};