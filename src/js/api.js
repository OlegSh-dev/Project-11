/**
 * класс для общения с сервером
 */
class Api {
	/**
	 * конструктор объекта api
	 * @param {Object} - деструктурированный объект из данных для запроса на сервер
	 */
	constructor({baseUrl, headers: {authorization, contentType = null}}) {
		this.baseUrl = baseUrl;
		this.authorization = authorization;
		this.contentType = contentType;
	}

	/**
	 * метод проверки статуса ответа от сервера на запрос, если ОК, то полученный промис превращаем в json, 
	 * иначе пробрасываем отказ с кодом ошибки
	 * @param {Object} res - ответ от сервера
	 */
	checkResponseStatus(res) {
		if (res.ok) {
			return res.json()
		}
		return Promise.reject(res.status)
	}
  
	/**
	 * асинхронный метод для загрузки с сервера карточек на страницу
	 */
	async getInitialCards() {
		const res = await fetch(`${this.baseUrl}/cards`, {
					headers: {
						authorization: this.authorization
					}
		});
		return this.checkResponseStatus(res);
	}

	/**
	 * метод для запроса с сервера информации о пользователе
	 */
	getUserData() {
		return fetch(`${this.baseUrl}/users/me`, {
					headers: {
						authorization: this.authorization
					}
				})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * метод для обновления данных пользователя на сервере
	 * @param {string} name - значение поля формы редактирования профиля
	 * @param {string} about - значение поля формы редактирования профиля
	 */
	updateUserData(name, about) {
		return fetch(`${this.baseUrl}/users/me`, {
			method: 'PATCH',
			headers: {
				authorization: this.authorization,
				'Content-Type': this.contentType
			},
			body: JSON.stringify({
				name: name,
				about: about
			})
		})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * метод для загрузки новой карточки на сервер
	 * @param {string} name - заголовок карточки
	 * @param {string} link - ссылка на картинку карточки
	 */
	postCard(name, link) {
		return fetch(`${this.baseUrl}/cards`, {
			method: 'POST',
			headers: {
				authorization: this.authorization,
				'Content-Type': this.contentType
			},
			body: JSON.stringify({
				name: name,
				link: link
			})
		})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * метод для удаления карточки с сервера
	 * @param {string} cardId - идентификатор карточки
	 */
	deleteCard(cardId) {
		return fetch(`${this.baseUrl}/cards/${cardId}`, {
			method: 'DELETE',
			headers: {
				authorization: this.authorization,
			}
		})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * метод для постановки лайка на карточку
	 * @param {string} cardId - идентификатор карточки
	 */
	doLike(cardId) {
		return fetch(`${this.baseUrl}/cards/like/${cardId}`, {
			method: 'PUT',
			headers: {
				authorization: this.authorization,
			}
		})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * метод для удаления лайка пользователя с карточки
	 * @param {string} cardId - идентификатор карточки
	 */
	removeLike(cardId) {
		return fetch(`${this.baseUrl}/cards/like/${cardId}`, {
			method: 'DELETE',
			headers: {
				authorization: this.authorization
			}
		})
			.then(res => this.checkResponseStatus(res))
	}

	/**
	 * асинхронный метод для обновления ссылки на аватар пользователя на сервере
	 * @param {string} link - ссылка на новый аватар
	 */
	async updateAvatar(link) {
		const res = await fetch(`${this.baseUrl}/users/me/avatar`, {
			method: 'PATCH',
			headers: {
				authorization: this.authorization,
				'Content-Type': this.contentType
			},
			body: JSON.stringify({
				avatar: link
			})
		});
		return this.checkResponseStatus(res);
	}
}

export {Api};