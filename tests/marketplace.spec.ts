import { test, expect } from "@playwright/test";

test.describe("Kurio NFT Marketplace", () => {
  // TESTE 1 — Carregamento da página inicial
  test("deve carregar a página inicial e exibir os NFTs", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL(/localhost:5173/);

    const nftImages = page.locator("img[alt]");

    await expect(nftImages.first()).toBeAttached();
    await expect(page.locator("img[alt]:visible").first()).toBeVisible();

    expect(await nftImages.count()).toBeGreaterThan(0);
  });

  // TESTE 2 — Compra completa com confirmação pela API
  test("deve confirmar uma compra pela API simulada", async ({ page }) => {
    const email = `compra-${Date.now()}@kurio.test`;
    const password = "Teste123456";

    // 1. Inicializa o MSW.
    await page.goto("/");

    await page.waitForFunction(
      () => navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 15000 },
    );

    // 2. Cadastra um comprador.
    const registerStatus = await page.evaluate(
      async ({ email, password }) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Comprador Playwright",
            email,
            password,
          }),
        });

        return response.status;
      },
      { email, password },
    );

    expect(registerStatus).toBe(201);

    // 3. Faz login.
    await page.goto("/login");

    await page.locator("#login-email").fill(email);
    await page.locator("#login-password").fill(password);

    await page
      .getByRole("button", {
        name: "Entrar",
        exact: true,
      })
      .click();

    await expect(page).toHaveURL(/\/\?search=/);

    // 4. Abre os detalhes de um NFT.
    await page.goto("/nft/1");

    const addButton = page.getByRole("button", {
      name: "Adicionar ao carrinho",
    });

    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();

    // 5. Adiciona o NFT ao carrinho.
    await addButton.click();

    await expect(
      page.getByText(/unidade adicionada ao carrinho/i),
    ).toBeVisible();

    // 6. Acessa o carrinho pelo link real da aplicação.
    const cartLink = page.getByRole("link", {
      name: /Carrinho com \d+ itens/i,
    });

    await expect(cartLink).toBeVisible();
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart$/);

    await expect(page.getByText(/seu carrinho está vazio/i)).toHaveCount(0);

    // 7. Acessa o checkout.
    const checkoutLink = page.getByRole("link", {
      name: "Conectar e finalizar",
    });

    await expect(checkoutLink).toBeVisible();
    await checkoutLink.click();

    await expect(page).toHaveURL(/\/checkout/);

    // 8. Preenche os campos obrigatórios do checkout.
    await page.locator("#name").fill("Comprador Playwright");
    await page.locator("#username").fill("comprador");
    await page.locator("#network").selectOption("ethereum");
    await page.locator("#profileName").fill("Colecionador");

    await page
      .locator("#wallet")
      .fill("0x1234567890123456789012345678901234567890");

    await page.locator("#walletType").selectOption("WalletConnect");
    await page.locator("#email").fill(email);

    // 9. Seleciona a carteira visualmente.
    // O checkout exige selectedWallet além do campo walletType.
    const walletButton = page.getByRole("button", {
      name: "WalletConnect",
      exact: true,
    });

    await expect(walletButton).toBeVisible();
    await walletButton.click();

    await expect(walletButton).toHaveAttribute("aria-pressed", "true");

    // 10. Aguarda a resposta da API simulada.
    const orderResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/orders") &&
        response.request().method() === "POST",
    );

    // 11. Confirma a compra.
    const confirmButton = page.getByRole("button", {
      name: "Confirmar compra",
      exact: true,
    });

    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    const orderResponse = await orderResponsePromise;

    // 12. Verifica o retorno da API.
    expect(orderResponse.status()).toBe(201);

    const order = await orderResponse.json();

    expect(order.status).toBe("confirmed");
    expect(order.id).toBeTruthy();

    // 13. Verifica a confirmação visual da compra.
    const confirmation = page.getByRole("dialog");

    await expect(confirmation).toBeVisible();

    await expect(confirmation.getByText("Pedido confirmado!")).toBeVisible();

    // O modal deve apresentar o mesmo ID retornado pela API.
    await expect(confirmation.getByText(order.id)).toBeVisible();
  });

  // TESTE 3 — Cadastro e login
  test("deve cadastrar um usuário e realizar login", async ({ page }) => {
    const email = `teste-${Date.now()}@kurio.test`;
    const password = "Teste123456";

    // Inicializa o MSW.
    await page.goto("/");

    await page.waitForFunction(
      () => navigator.serviceWorker.controller !== null,
      undefined,
      { timeout: 15000 },
    );

    // Cadastra o usuário na API simulada.
    const registerResponse = await page.evaluate(
      async ({ email, password }) => {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Usuário Playwright",
            email,
            password,
          }),
        });

        return { status: response.status };
      },
      { email, password },
    );

    expect(registerResponse.status).toBe(201);

    // Abre a tela de login.
    await page.goto("/login");

    await page.locator("#login-email").fill(email);
    await page.locator("#login-password").fill(password);

    // Realiza o login.
    await page
      .getByRole("button", {
        name: "Entrar",
        exact: true,
      })
      .click();

    // Verifica o redirecionamento.
    await expect(page).toHaveURL(/\/\?search=.*page=1/);
  });

  // TESTE 4 — Detalhes de NFT
  test("deve abrir os detalhes de um NFT", async ({ page }) => {
    await page.goto("/nft/1");

    await expect(page).toHaveURL(/\/nft\/1$/);
    await expect(page.locator("body")).not.toBeEmpty();

    await expect(
      page.getByRole("button", {
        name: "Adicionar ao carrinho",
      }),
    ).toBeVisible();
  });

  // TESTE 5 — Adicionar NFT ao carrinho
  test("deve adicionar um NFT ao carrinho", async ({ page }) => {
    await page.goto("/nft/1");

    const addButton = page.getByRole("button", {
      name: "Adicionar ao carrinho",
    });

    await expect(addButton).toBeVisible();
    await expect(addButton).toBeEnabled();

    // Adiciona o NFT.
    await addButton.click();

    await expect(
      page.getByText(/unidade adicionada ao carrinho/i),
    ).toBeVisible();

    // Navega pelo link do cabeçalho.
    await page
      .getByRole("link", {
        name: /Carrinho com \d+ itens/i,
      })
      .click();

    await expect(page).toHaveURL(/\/cart$/);

    // Verifica se o carrinho possui produtos.
    await expect(page.getByText(/seu carrinho está vazio/i)).toHaveCount(0);

    await expect(
      page.getByRole("link", {
        name: "Conectar e finalizar",
      }),
    ).toBeVisible();
  });

  // TESTE 6 — Navegação do carrinho para checkout
  test("deve navegar do carrinho para o checkout", async ({ page }) => {
    await page.goto("/nft/1");

    const addButton = page.getByRole("button", {
      name: "Adicionar ao carrinho",
    });

    await expect(addButton).toBeEnabled();
    await addButton.click();

    await expect(
      page.getByText(/unidade adicionada ao carrinho/i),
    ).toBeVisible();

    // Navega pelo cabeçalho.
    const cartLink = page.getByRole("link", {
      name: /Carrinho com \d+ itens/i,
    });

    await expect(cartLink).toBeVisible();
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart$/);

    // Confirma que o carrinho não está vazio.
    await expect(page.getByText(/seu carrinho está vazio/i)).toHaveCount(0);

    // Clica para finalizar.
    const checkoutLink = page.getByRole("link", {
      name: "Conectar e finalizar",
    });

    await expect(checkoutLink).toBeVisible();
    await checkoutLink.click();

    // Confirma que chegou ao checkout.
    await expect(page).toHaveURL(/\/checkout/);

    await expect(page.locator("#name")).toBeVisible();
  });

  // TESTE 7 — Ordenação por menor preço
  test("deve ordenar os NFTs pelo menor preço", async ({ page }) => {
    await page.goto("/");

    const sort = page.locator("#desktop-sort");

    await expect(sort).toBeVisible();

    await sort.selectOption("price_asc");

    await expect(page).toHaveURL(/sort=price_asc/);
    await expect(sort).toHaveValue("price_asc");
  });

  // TESTE 8 — Filtro pela rede Ethereum
  test("deve filtrar NFTs pela rede Ethereum", async ({ page }) => {
    await page.goto("/");

    const ethereum = page
      .locator('input[name="desktop-network"][type="radio"]')
      .nth(1);

    await expect(ethereum).toBeEnabled();

    await ethereum.check();

    await expect(page).toHaveURL(/network=ethereum/);
  });
});
