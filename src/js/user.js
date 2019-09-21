import {api} from '../index';

/**
 *  класс пользователя для работы с информацией о нем
 */
class User {
	constructor() {
		api.getUserData()
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

export {User};