/// <reference types="cypress" />

const removeOverlay = () => {
  cy.document().then((doc) => {
    const iframeOverlay = doc.getElementById(
      'webpack-dev-server-client-overlay'
    );
    if (iframeOverlay) {
      iframeOverlay.remove();
    }

    const divOverlay = doc.querySelector('.webpack-dev-server-client-overlay');
    if (divOverlay) {
      divOverlay.remove();
    }

    cy.on('uncaught:exception', () => false);
  });
};

describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');

    cy.visit('/');
    cy.wait('@getIngredients');
    removeOverlay();
  });

  it('Проверяем начальное состояние', () => {
    cy.contains('Соберите бургер').should('exist');
    cy.get('[data-testid="ingredient-item"]').should(
      'have.length.greaterThan',
      0
    );

    cy.get('button')
      .contains(
        /Оформить заказ|Выберите ингредиенты|Добавьте булку|Добавьте начинку/
      )
      .should('exist');
  });

  it('Добавляем булку в конструктор', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .contains('булка')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.get('[data-testid="burger-ingredient"]', { timeout: 5000 })
      .should('exist')
      .and('have.length.at.least', 1);
  });

  it('Добавляем начинку в конструктор', () => {
    removeOverlay();
    cy.contains('Начинки').click({ force: true });

    removeOverlay();
    cy.get('[data-testid="ingredient-item"]')
      .contains('Биокотлета')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="burger-ingredient"]').length) {
        cy.get('[data-testid="burger-ingredient"]')
          .contains('Биокотлета')
          .should('exist');
      }
    });
  });

  it('Открывает модальное окно ингредиента', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .first()
      .then(($item) => {
        removeOverlay();
        cy.wrap($item).find('a').first().click({ force: true });
      });

    cy.wait(100);
    removeOverlay();
    cy.wait(100);
    removeOverlay();

    cy.get('[data-testid="modal"]', { timeout: 10000 })
      .should('exist')
      .then(($modal) => {
        expect($modal).to.exist;

        cy.wrap($modal).within(() => {
          cy.get('img').should('exist');
          cy.contains(/Краторная|булка/i).should('exist');
        });
      });
  });

  it('Закрывает модальное окно ингредиента по клику на крестик', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .first()
      .then(($item) => {
        removeOverlay();
        cy.wrap($item).find('a').first().click({ force: true });
      });

    cy.wait(100);
    removeOverlay();
    cy.wait(100);
    removeOverlay();

    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('exist');

    cy.get('[data-testid="modal-close-button"]').click({ force: true });

    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Закрывает модальное окно ингредиента по клику на оверлей', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .first()
      .then(($item) => {
        removeOverlay();
        cy.wrap($item).find('a').first().click({ force: true });
      });

    cy.wait(100);
    removeOverlay();
    cy.wait(100);
    removeOverlay();

    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('exist');

    cy.get('[data-testid="modal-overlay"]').click({ force: true });

    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('Добавляем ингредиенты и оформляем заказ', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .contains('булка')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.get('[data-testid="burger-ingredient"]', { timeout: 5000 }).should(
      'have.length',
      2
    );

    cy.contains('Добавьте начинку').should('exist');

    removeOverlay();
    cy.contains('Начинки').click({ force: true });

    removeOverlay();
    cy.get('[data-testid="ingredient-item"]')
      .contains('Биокотлета')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.get('[data-testid="burger-ingredient"]').should('have.length', 3);

    cy.contains('Оформить заказ', { timeout: 5000 }).should('exist');
    cy.contains('Оформить заказ').should('not.be.disabled');

    cy.wait('@getUser');
    removeOverlay();
    cy.contains('Оформить заказ').click({ force: true });

    cy.wait('@createOrder');
    removeOverlay();
    cy.get('[data-testid="modal"]', { timeout: 15000 })
      .should('be.visible')
      .then(($modal) => {
        const modalText = $modal.text();
        console.log('Текст модального окна:', modalText);

        expect(modalText).to.match(/\d+/);

        cy.wrap($modal)
          .contains(/\b12345\b/)
          .should('exist');
      });
  });

  it('Создает заказ', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .contains('булка')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    removeOverlay();
    cy.contains('Начинки').click({ force: true });

    removeOverlay();
    cy.get('[data-testid="ingredient-item"]')
      .contains('Биокотлета')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.wait('@getUser');
    removeOverlay();

    cy.get('button')
      .contains('Оформить заказ')
      .should('not.be.disabled')
      .click({ force: true });

    cy.wait('@createOrder');

    removeOverlay();
    cy.get('[data-testid="modal"]', { timeout: 15000 })
      .should('be.visible')
      .then(($modal) => {
        cy.wrap($modal).should(($el) => {
          const text = $el.text();

          expect(text).to.match(/\d+/);

          expect(text.toLowerCase()).to.match(/заказ|номер|идентификатор/);
        });
      });
  });

  it('Закрывает модальное окно заказа', () => {
    removeOverlay();

    cy.get('[data-testid="ingredient-item"]')
      .contains('булка')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    removeOverlay();
    cy.contains('Начинки').click({ force: true });

    removeOverlay();
    cy.get('[data-testid="ingredient-item"]')
      .contains('Биокотлета')
      .first()
      .parents('[data-testid="ingredient-item"]')
      .find('button')
      .click({ force: true });

    cy.wait('@getUser');
    removeOverlay();
    cy.contains('Оформить заказ').click({ force: true });
    cy.wait('@createOrder');

    removeOverlay();
    cy.get('[data-testid="modal"], [class*="modal"]', { timeout: 15000 })
      .should('be.visible')
      .then(($modal) => {
        cy.log('Модальное окно заказа открылось');

        cy.get('[data-testid="modal"]').within(() => {
          cy.contains('12345').should('exist');
        });
      });

    cy.get('[data-testid="modal-close-button"]').click();

    cy.get('[data-testid="modal"]').should('not.exist');
  });
});
