import { test, expect } from '@playwright/test';

const constructorSection = 'constructor';

const modalContent = '#modals >> text=Детали ингредиента';
const modalCloseButton = '#modals button';
const ModalOverlay =
  '#modals [class*="overlay"], #modals [class*="Overlay"], #modals > div:first-child';

  test.describe('constructor works correctly', () => {
    test.beforeEach(async ({ page }) => {
      await page.routeFromHAR('tests/hars/api.har', {
        url: '**/api/**',
        update: false,
      });

      await page.goto('/');
      await page.locator('text=Краторная булка N-200i').first().waitFor({ state: 'visible' });
    });

    test.describe('add ingredients to constructor works correctly', () => {
      test('add bun and filling works correctly', async ({ page }) => {
        await page.locator('li', { hasText: 'Краторная булка N-200i' })
          .locator('button:has-text("Добавить")').click();
        await page.locator('li', { hasText: 'Биокотлета из марсианской Магнолии' })
          .locator('button:has-text("Добавить")').click();

        const constructor = page.getByTestId(constructorSection);
        await expect(constructor).toContainText('Краторная булка N-200i');
        await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');
      });
    });

    test.describe('modals work correctly', () => {
      test.beforeEach(async ({ page }) => {
        await page.locator('text=Краторная булка N-200i').first().click();
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
          document.cookie = 'accessToken=Bearer%20mock-valid-access-token; path=/;';
        });

        await page.goto('/');
        await page.locator('text=Краторная булка N-200i').first().waitFor({ state: 'visible' });

        await page.locator('li', { hasText: 'Краторная булка N-200i' })
          .locator('button:has-text("Добавить")').click();
        await page.locator('li', { hasText: 'Биокотлета из марсианской Магнолии' })
          .locator('button:has-text("Добавить")').click();

        const constructor = page.getByTestId(constructorSection);
        await expect(constructor).toContainText('Краторная булка N-200i');
        await expect(constructor).toContainText('Биокотлета из марсианской Магнолии');

        const orderButton = page.locator('button:has-text("Оформить заказ")');
        await expect(orderButton).toBeEnabled();
        await orderButton.click();

        await expect(page.locator('#modals')).toContainText('77432');

        await page.locator(modalCloseButton).first().click();
        await expect(page.locator('#modals')).not.toContainText('77432');

        const orderPrice = constructor.locator('text=0').first();
        await expect(orderPrice).toBeVisible();

        const bunPlaceholder = constructor.locator('text=Выберите булки').first();
        const mainPlaceholder = constructor.locator('text=Выберите начинку').first();
        await expect(bunPlaceholder).toBeVisible();
        await expect(mainPlaceholder).toBeVisible();
      });
    });
  });
