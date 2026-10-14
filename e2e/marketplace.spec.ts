import { test, expect } from '@playwright/test';

test.describe('KURIO NFT Marketplace - Fluxos E2E', () => {
  test('1. Catálogo, filtros, busca e navegação para o Detalhe do NFT', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('SEJA DONO DO FUTURO DA ARTE DIGITAL')).toBeVisible();
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible();

    await page.getByText('Emerald Ape #042').first().click();
    await expect(page).toHaveURL(/\/nft\/1/);
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible();
  });

  test('2. Carrinho, aplicação de cupom KURIO10 e Checkout até Confirmação', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByText('Emerald Ape #042').first()).toBeVisible();

    const couponInput = page.getByPlaceholder('Digite o código promocional...');
    await couponInput.fill('KURIO10');
    await page.getByRole('button', { name: 'Aplicar' }).click();
    await expect(page.getByText(/Cupom KURIO10 ativo/i)).toBeVisible();

    await page.getByRole('button', { name: /Conectar e finalizar/i }).click();
    await expect(page).toHaveURL(/\/payment/);

    await page.getByRole('button', { name: /Confirmar compra/i }).first().click();
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.getByText('Seus NFTs agora estão na sua carteira')).toBeVisible();
  });

  test('3. Perfil do colecionador e Carteiras', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.getByText('Perfil do colecionador').first()).toBeVisible();

    await page.goto('/wallets');
    await expect(page.getByText('Carteira principal').first()).toBeVisible();
  });
});