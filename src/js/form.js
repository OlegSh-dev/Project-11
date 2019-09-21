import {Popup} from './popup';

const closeIcon = require('../../public/img/close.svg');

/**
 * класс для создания форм
 */
class Form {
	constructor(event) {
		const obj = this;
		this.formElement = this.create(event);
		this.open();
		this.showData(event);

		const inputArr = this.formElement.querySelectorAll('input');
		this.enableButton(inputArr, this.formElement.querySelector('.button'));

		this.formElement.querySelector('.popup__close').addEventListener('click', Popup.close);

		this.formElement.querySelector('.popup__form').addEventListener('input', function(event) {
			obj.checkInputValidity(event, inputArr, obj.formElement.querySelector('.button'));
		});

		this.formElement.addEventListener('submit', this.applyData.bind(this)); // фиксируем контекст

	}

	/**
	 * метод для создания нужной разметки формы в зависимости от кнопки, на которую нажал пользователь
	 * @param {Object} event 
	 */
	create(event) {
		if (event.target.classList.contains('user-info__button')) {

			return this.createNewPlaceFormMarkup();
		} else if (event.target.classList.contains('user-info__edit-button')) {

			return this.createEditUserFormMarkup();
		} else if (event.target.classList.contains('user-info__photo')) {

			return this.createEditAvatarFormMarkup();
		}
	}

	/**
	 * метод, возвращающий контейнер с присоединенными элементами на основе шаблонной разметки
	 * @param {string} stringHTML - разметка блока в текстовом виде
	 */
	makeFormContainer(stringHTML) {
		const template = document.createElement('div');
		template.classList.add('popup__content');

		template.insertAdjacentHTML('afterbegin', stringHTML);

		return template;
	}

	/**
	 * метод возвращает разметку для формы добавления новой карточки
	 */
	createNewPlaceFormMarkup() {
		const stringHTML = `<img src=${closeIcon} alt="" class="popup__close">
			<h3 class="popup__title popup__title_place">Новое место</h3>
			<form class="popup__form popup__form_place" name="new" novalidate>
				<input type="text" name="name" class="popup__input popup__input_type_name" placeholder="Название" required minlength="2" maxlength="30">
				<span class="error" id="errName"></span>
				<input type="url" name="link" class="popup__input popup__input_type_link-url" placeholder="Ссылка на картинку" required pattern="https?://.*">
				<span class="error" id="errLink"></span>
				<button type="submit" class="button popup__button">+</button>
			</form>`.trim();
		
		return this.makeFormContainer(stringHTML);
	}

	/**
	 * метод возвращает разметку для формы редактирования профиля пользователя
	 */
	createEditUserFormMarkup() {
		const stringHTML = `<img src=${closeIcon} alt="" class="popup__close">
			<h3 class="popup__title popup__title_place">Редактировать профиль</h3>
			<form class="popup__form popup__form_user" name="user" novalidate>
				<input type="text" name="user" class="popup__input popup__input_type_user-name" placeholder="Имя" required minlength="2" maxlength="30">
				<span class="error" id="errUser"></span>
				<input type="text" name="about" class="popup__input popup__input_type_user-about" placeholder="О себе" required minlength="2" maxlength="30">
				<span class="error" id="errAbout"></span>
				<button type="submit" class="button popup__button popup__button_fs18">Сохранить</button>
			</form>`.trim();

		return this.makeFormContainer(stringHTML);
	}

	/**
	 * метод возвращает разметку формы редактирования аватара
	 */
	createEditAvatarFormMarkup() {
		const stringHTML = `<img src=${closeIcon} alt="" class="popup__close">
			<h3 class="popup__title popup__title_place">Обновить аватар</h3>
			<form class="popup__form popup__form_avatar" name="avatar" novalidate>
				<input type="url" name="link" class="popup__input popup__input_type_link-url" placeholder="Ссылка на аватар" required pattern="https?://.*">
				<span class="error" id="errLink"></span>
				<button type="submit" class="button popup__button popup__button_fs18">Сохранить</button>
			</form>`.trim();

		return this.makeFormContainer(stringHTML);
	}

	/**
	 * метод для показа процесса загрузки данных на сервер на кнопке формы
	 */
	renderLoading() {
		this.formElement.querySelector('.button').textContent = 'Загрузка...';
		this.formElement.querySelector('.button').style.fontSize = '18px';
	}
	

	/**
	 * метод для принятия данных формы в зависимости от типа формы
	 * @param {Object} event 
	 */
	applyData(event) {
		if (event.target.classList.contains('popup__form_user')) {
			event.preventDefault();

			this.renderLoading();
			api.updateUserData(document.forms.user.user.value, document.forms.user.about.value)
				.then(() => user.setUserDataOnPage(document.forms.user.user.value, document.forms.user.about.value))
				.then(() => Popup.close())
				.catch(err => console.error(`Ошибка обновления данных пользователя: ${err}`));
		}

		if (event.target.classList.contains('popup__form_place')) {
			event.preventDefault();

			this.renderLoading();
			api.postCard(document.forms.new.name.value, document.forms.new.link.value)
			
				.then(result => placesListEl.addCard(result.name, result.link, result.likes, result._id, result.owner._id))
				.then(() => Popup.close())
				.catch(err  => console.error(`Ошибка добавления карточки: ${err}`));
		}

		if (event.target.classList.contains('popup__form_avatar')) {
			event.preventDefault();

			this.renderLoading();

			api.updateAvatar(document.forms.avatar.link.value)

				.then(res => user.setUserAvatarOnPage(res.avatar))
				.then(() => Popup.close())
				.catch(err  => console.error(`Ошибка обновления аватара: ${err}`));
		}
	}

	/**
	 * метод для открытия попапа с формой
	 */
	open() {
		const popup = new Popup(document.querySelector('.root'));

		popup.popupElement.appendChild(this.formElement);
		popup.popupElement.classList.add('popup_is-opened');

		this.formElement.querySelector('.button').disabled = true;
	}

	/**
	 * метод для показа текущих значений параметров пользователя в форме редактирования профиля при ее открытии
	 * @param {Object} event 
	 */
	showData(event) {
		if (event.target.classList.contains('user-info__edit-button')) {
			document.forms.user.user.value = document.querySelector('.user-info__name').textContent;
			document.forms.user.about.value = document.querySelector('.user-info__job').textContent;
		}
	}

	/**
	 * метод для проверки валидности всех полей
	 * @param {Object} inputArr - коллекция инпутов формы
	 */
	checkInputs(inputArr) {
		let res = true;
		for (let input of inputArr) {
			if (!input.validity.valid) {
				res = false;
				break;
			}
		}
		return res;
	}

	/**
	 * метод для блокировки/разблокировки кнопки сабмита формы
	 * @param {Object} inputArr - коллекция инпутов формы
	 * @param {HTMLElement} button - элемент кнопки формы
	 */
	enableButton(inputArr, button) {
		button.disabled = !this.checkInputs(inputArr);
	}

	/**
	 * метод для проявки ошибки обязательного поля
	 * @param {HTMLElement} errEl - элемент с разметкой ошибки
	 */
	enableErrorValueMissing(errEl) {
		errEl.textContent = 'Это обязательное поле';
	}

	/**
	 * метод для проявки ошибки минимального количества символов
	 * @param {HTMLElement} errEl - элемент с разметкой ошибки
	 */
	enableErrorTooShort(errEl) {
		errEl.textContent = 'Должно быть от 2 до 30 символов';
	}

	/**
	 * метод для проявки ошибки неверного формата ссылки
	 * @param {HTMLElement} errEl - элемент с разметкой ошибки
	 */

	enableErrorPatternMismatch(errEl) {
		errEl.textContent = 'Введите ссылку в правильном формате';
	}

	/**
	 * метод для проверки полей на заданные ошибки и проявку соответствующей надписи об этом с блокировкой кнопки
	 * @param {Object} event 
	 * @param {Object} inputArr - коллекция инпутов формы
	 * @param {HTMLElement} button - элемент кнопки формы
	 */
	checkInputValidity(event, inputArr, button) {
		if (event.target.validity.valueMissing || event.target.value.replace(/\s/g, '') === '') {
			this.enableErrorValueMissing(event.target.nextElementSibling);
			this.enableButton(inputArr, button);
			return;
		}
		if (event.target.validity.tooShort) {
			this.enableErrorTooShort(event.target.nextElementSibling);
			this.enableButton(inputArr, button);
			return;
		}
		if (event.target.validity.patternMismatch) {
			this.enableErrorPatternMismatch(event.target.nextElementSibling);
			this.enableButton(inputArr, button);
			return;
		} 

		event.target.nextElementSibling.textContent = '';
		this.enableButton(inputArr, button);
	}
}

export {Form};
export {closeIcon};