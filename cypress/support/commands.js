/// <reference types="cypress" />

/**
 * Добавляет ингредиент в конструктор бургера
 * @param {string} ingredientName - Название ингредиента
 * @example
 * cy.addIngredientToConstructor('Краторная булка')
 */
Cypress.Commands.add('addIngredientToConstructor', (ingredientName) => {
  cy.get('[class*="burger-ingredient"]')
    .contains(ingredientName)
    .first()
    .parents('[class*="burger-ingredient"]')
    .find('button')
    .click();
});

/**
 * Переключает вкладку в конструкторе бургера
 * @param {string} tabName - Название вкладки (Булки, Начинки, Соусы)
 * @example
 * cy.switchToTab('Начинки')
 */
Cypress.Commands.add('switchToTab', (tabName) => {
  cy.contains(tabName).click();
});

/**
 * Создает тестовый заказ бургера
 * @example
 * cy.createBurgerOrder()
 */
Cypress.Commands.add('createBurgerOrder', () => {
  // Добавляем булку
  cy.addIngredientToConstructor('булка');

  // Переходим к начинкам и добавляем
  cy.switchToTab('Начинки');
  cy.addIngredientToConstructor('Биокотлета');

  // Ждем загрузки пользователя
  cy.wait('@getUser');

  // Нажимаем кнопку оформления заказа
  cy.contains('Оформить заказ').click();

  // Ждем создания заказа
  cy.wait('@createOrder');
});

/**
 * Авторизует пользователя с моковыми токенами
 * @example
 * cy.loginWithMockTokens()
 */
Cypress.Commands.add('loginWithMockTokens', () => {
  cy.setCookie('accessToken', 'mock-access-token');
  window.localStorage.setItem('refreshToken', 'mock-refresh-token');
});

/**
 * Очищает все данные авторизации
 * @example
 * cy.clearAuth()
 */
Cypress.Commands.add('clearAuth', () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.reload();
});

/**
 * Открывает модальное окно ингредиента по названию
 * @param {string} ingredientName - Название ингредиента
 * @example
 * cy.openIngredientModal('Краторная булка')
 */
Cypress.Commands.add('openIngredientModal', (ingredientName) => {
  cy.get('[class*="burger-ingredient"]')
    .contains(ingredientName)
    .first()
    .click();
});

/**
 * Закрывает открытое модальное окно
 * @example
 * cy.closeModal()
 */
Cypress.Commands.add('closeModal', () => {
  // Сначала пытаемся кликнуть на оверлей
  cy.get('body').then(($body) => {
    if ($body.find('[class*="overlay"]').length > 0) {
      cy.get('[class*="overlay"]').click({ force: true });
    } else {
      // Если нет оверлея, ищем крестик
      cy.get('[class*="modal"]').find('button[class*="close"]').click();
    }
  });
});

/**
 * Проверяет, что модальное окно открыто
 * @example
 * cy.modalShouldBeOpen()
 */
Cypress.Commands.add('modalShouldBeOpen', () => {
  cy.get('[class*="modal"]').should('be.visible');
});

/**
 * Проверяет, что модальное окно закрыто
 * @example
 * cy.modalShouldBeClosed()
 */
Cypress.Commands.add('modalShouldBeClosed', () => {
  cy.get('[class*="modal"]').should('not.exist');
});

/**
 * Проверяет, что конструктор бургера пуст
 * @example
 * cy.constructorShouldBeEmpty()
 */
Cypress.Commands.add('constructorShouldBeEmpty', () => {
  cy.get('[class*="burger-constructor"]')
    .contains('Выберите булки')
    .should('exist');

  cy.get('[class*="burger-constructor"]')
    .contains('Выберите начинку')
    .should('exist');
});

/**
 * Настраивает интерцепторы для тестов конструктора
 * @example
 * cy.setupConstructorInterceptors()
 */
Cypress.Commands.add('setupConstructorInterceptors', () => {
  cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
    'createOrder'
  );
});
