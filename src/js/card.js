'use strict';

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
		//создаем разметку в виде текста, удалив лишние пробелы
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
		
		//создаем контейнер для карточки
		const template = document.createElement('div');
		template.classList.add('place-card');
		template.setAttribute('data-_id', _id);
		template.setAttribute('data-owner', owner);

		//вставляем в контейнер разметку
		template.insertAdjacentHTML('afterbegin', stringHTML);

		return template;
	}

	/**
	 * метод для установки различных наблюдателей
	 */
	addListeners() {
		// сразу при создании карточки навешиваем обработчики на элементы
		this.cardElement.querySelector('.place-card__like-icon').addEventListener('click', this.like.bind(this));
		this.cardElement.querySelector('.place-card__image').addEventListener('click', this.openImage);

		// навешиваем на описание обработчик для всплытия подсказки с владельцем и именами пользователей, которые лайкнули карточку
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
			// обработчик на удаление карточки вешаем только на карточки текущего пользователя
			this.cardElement.querySelector('.place-card__delete-icon').addEventListener('click', this.remove.bind(this));
		}
	}

	/**
	 * метод для смены стиля иконки лайк при нажатии на нее
	 */
	like() {
		// если лайк на карточке не стоит, то вызываем метод для постановки лайка с отправкой данных на сервер
		if (!this.cardElement.querySelector('.place-card__like-icon').classList.contains('place-card__like-icon_liked')) {

			// по принципу Optimistic UI сначала закрашиваем сердечко и увеличиваем счетчик лайков на клиенте
			this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
			this.cardElement.querySelector('.place-card__like-counter').textContent = +this.cardElement.querySelector('.place-card__like-counter').textContent + 1;

			// при лайке пушим в массив с лайками имя пользователя
			this.likes.push(document.querySelector('.user-info__name').textContent);

			// затем делаем запрос на сервер через метод класса api
			api.doLike(this.cardElement.dataset._id)
				// корректируем цифру лайков актуальной информацией с сервера, если промис зарезолвился
				.then(card => this.cardElement.querySelector('.place-card__like-counter').textContent = card.likes.length)
				.catch(err => { 
					console.error(`Ошибка регистрации лайка: ${err}`);
					// в случае ошибки откатываем состояние элементов
					this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked');
					this.cardElement.querySelector('.place-card__like-counter').textContent = +this.cardElement.querySelector('.place-card__like-counter').textContent - 1;
				});
		} else {
			// если лайк стоял, то удаляем его и обновляем информацию на странице
			api.removeLike(this.cardElement.dataset._id)
				.then(card => this.cardElement.querySelector('.place-card__like-counter').textContent = card.likes.length)
				.then(() => this.cardElement.querySelector('.place-card__like-icon').classList.toggle('place-card__like-icon_liked'))
				// при снятии лайка удаляем имя пользователя из массива с лайками
				.then(() => this.likes.splice(this.likes.indexOf(document.querySelector('.user-info__name').textContent), 1))
				.catch(err => {
					// если лайк не прошел на сервере, то удаляем имя пользователя из массива с лайками
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
			// вызываем конструктор попапа
			const popup = new Popup(document.querySelector('.root'));

			// объявляем разметку для кнопки закрытия картинки
			const closeIcon = `<img src="./img/close.svg" alt="" class="popup__close">`;

			const imgContainer = document.createElement('div');
			const img = document.createElement('img');

			// вытаскиваем ссылку на картинку из карточки и ставим в атрибут
			img.setAttribute('src', event.target.style.backgroundImage.slice(5, -2));
			img.classList.add('popup__img');

			imgContainer.classList.add('popup__image-container');

			// вешаем обработчик закрытия попапа с использованием статического метода класса
			imgContainer.addEventListener('click', Popup.close);

			// собираем элементы попапа картинки
			imgContainer.appendChild(img);
			imgContainer.insertAdjacentHTML('afterbegin', closeIcon.trim());
	
			//	присоединяем элементы попапа картинки к объекту попап
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
			// если лайков 0, то ничего не делаем
			if (this.likes.length === 0) {
				return;
			} else {
				// иначе записываем данные из массива в див тултипа
				tooltip.textContent = this.likes.join(', ');
			}	
		} else if (event.target.classList.contains('place-card__like-icon')) {
			return;
		} else {
			// выводим имя владельца карточки
			tooltip.textContent = this.ownerName || document.querySelector('.user-info__name').textContent;
		}

		// позицию дива с подсказкой определяем по координатам мыши от начала страницы + 10 пикс
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