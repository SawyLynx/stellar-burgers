import { test, expect } from '@playwright/test';

const mockCratorBun = 'text=Краторная булка N-200i';

const constructorSection = 'main';

const modalContent = '#modals >> text=Детали ингредиента';
const modalCloseButton = '#modals button';
const ModalOverlay =
  '#modals [class*="overlay"], #modals [class*="Overlay"], #modals > div:first-child';

test.describe('constructor works correctly', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/api.har', {
      url: /\/api\//,
      update: false,
      notFound: 'fallback',
    });

    await page.goto('/');
    await page
      .locator('button:has-text("Добавить")')
      .first()
      .waitFor({ state: 'visible' });
  });

  test.describe('add ingredients to constructor works correctly', () => {
    test('add bun and filling works correctly', async ({ page }) => {
      await page.locator('button:has-text("Добавить")').nth(0).click();
      await page.locator('button:has-text("Добавить")').nth(1).click();

      const constructor = page.locator(constructorSection);
      await expect(constructor).toContainText('Краторная булка N-200i');
      await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');
    });
  });

  test.describe('modals work correctly', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator(mockCratorBun).first().click();
      await page.locator(modalContent).waitFor({ state: 'visible' });
    });

    test('open modal works correctly', async ({ page }) => {
      await expect(page.locator(modalContent)).toBeVisible();
      await expect(page.locator('#modals')).toContainText('Краторная булка N-200i');
    });

    test('close modal button works correctly', async ({ page }) => {
      await page.locator(modalCloseButton).first().click();
      await expect(page.locator(modalContent)).not.toBeVisible();
    });

    test('close modal on overlay works correctly', async ({ page }) => {
      await page
        .locator(ModalOverlay)
        .first()
        .click({ force: true, position: { x: 5, y: 5 } });
      await expect(page.locator(modalContent)).not.toBeVisible();
    });
  });

  test.describe('create order works correctly', () => {
    test('burger constuctor and auth works correctly', async ({ page, context }) => {
      await context.addInitScript(() => {
        window.localStorage.setItem('refreshToken', 'mock-valid-refresh-token');
        document.cookie = 'accessToken=Bearer mock-valid-access-token; path=/';
      });

      await page.route('**/api/auth/user', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            user: {
              email: 'tester@mail.ru',
              name: 'Tester',
            },
          }),
        });
      });

      await page.route('**/api/orders', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            name: 'Краторный био-марсианский бургер',
            order: {
              number: 77432,
            },
          }),
        });
      });

      await page.goto('/');
      await page
        .locator('button:has-text("Добавить")')
        .first()
        .waitFor({ state: 'visible' });

      await page.locator('button:has-text("Добавить")').nth(0).click();
      await page.locator('button:has-text("Добавить")').nth(1).click();

      const constructor = page.locator('main');
      await expect(constructor).toContainText('Краторная булка N-200i');
      await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');

      const orderButton = page.locator('button:has-text("Оформить заказ")');
      await expect(orderButton).toBeEnabled();
      await orderButton.click();

      await expect(page.locator('body')).toContainText('77432');

      await page.locator(modalCloseButton).first().click();
      await expect(page.locator('body')).not.toContainText('77432');

      const orderPrice = page.locator('main >> text=0').first();
      await expect(orderPrice).toBeVisible();

      const bunPlaceholder = page.locator('text=Выберите булки').first();
      const mainPlaceholder = page.locator('text=Выберите начинку').first();
      await expect(bunPlaceholder).toBeVisible();
      await expect(mainPlaceholder).toBeVisible();
    });
  });
});
