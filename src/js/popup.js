/**
 * класс для использования в качестве конструктора при создании всплывающих окон
 */
class Popup {
	constructor(container) {
		this.container = container;
		this.popupElement = this.create();
		this.container.appendChild(this.popupElement);
	}

	/**
	 * метод возвращает элемент для вставки его в DOM
	 */
	create() {
		const template = document.createElement('div');
		template.classList.add('popup');

		return template;
	}

	/**
	 * статический метод для закрытия любого попапа, вызывается напрямую из класса
	 */
	static close() {
		document.querySelector('.popup').remove();
	}
}

export {Popup};