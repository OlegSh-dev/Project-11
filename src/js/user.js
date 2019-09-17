'use strict';

/**
 *  класс пользователя для работы с информацией о нем
 */
class User {
	constructor() {
		// вызываем метод класса api для запроса информации о пользователе
		api.getUserData()
			// из полученного объекта извлекаем нужные данные и  вызываем нужные методы для обновления DOM
			.then(user => {
				this.setUserAvatarOnPage(user.avatar);
				this.setUserDataOnPage(user.name, user.about);
				document.querySelector('.user-info__name').setAttribute('data-user_id', user._id);
			})
			.catch(err => console.error(`Ошибка загрузки данных пользователя: ${err}`));
	}

	/**
	 * метод для отрисовки в DOM имени пользователя и его профессии
	 * @param {string} name - значение для имени пользователя
	 * @param {string} about - значение для профессии
	 */
	setUserDataOnPage(name, about) {
		document.querySelector('.user-info__name').textContent = name;
		document.querySelector('.user-info__job').textContent = about;
	}

	/**
	 * метод для отрисовки в DOM аватарки пользователя
	 * @param {string} avatar - ссылка на аватар пользователя
	 */
	setUserAvatarOnPage(avatar) {
		document.querySelector('.user-info__photo').style.backgroundImage = `url(${avatar})`;
	}
}