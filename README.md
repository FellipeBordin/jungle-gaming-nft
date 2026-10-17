# Kurio NFT Marketplace

Marketplace demonstrativo de NFTs desenvolvido com **React, TypeScript e Vite** para o desafio técnico de Front-End da **Jungle Gaming**.

A aplicação permite explorar colecionáveis digitais, pesquisar e filtrar NFTs, visualizar detalhes, gerenciar um carrinho, criar uma conta e simular uma compra com confirmação de pedido. A interface é responsiva e utiliza uma API simulada com MSW.

## Demonstração

- **Aplicação:** https://jungle-gaming-nft.vercel.app/
- **Código-fonte:** https://github.com/FellipeBordin/jungle-gaming-nft
- **Arquitetura e decisões técnicas:** [ARCHITECTURE.md](./ARCHITECTURE.md)

> **Projeto demonstrativo:** autenticação, carteiras e pagamentos são simulados. Nenhuma criptomoeda é movimentada e nenhum NFT é transferido em blockchain.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Vite 8, Tailwind CSS 4, shadcn/ui, Lucide React |
| Navegação | TanStack Router |
| Dados e cache | TanStack Query, Axios e chamadas fetch em partes do catálogo |
| API demonstrativa | Mock Service Worker (MSW) |
| Tempo real | Socket.IO, com servidor Node.js |
| Testes | Playwright E2E e regressão visual, desktop e mobile |
| Hospedagem | Vercel (frontend) e Render (Socket.IO) |

## Funcionalidades

- Catálogo de NFTs com busca textual, filtros por rede, ordenação por preço e paginação.
- Página de detalhes com informações e disponibilidade de cada NFT.
- Carrinho com adição, remoção, ajuste de quantidades e persistência após atualizar a página.
- Separação do carrinho por usuário no navegador, com carrinho de visitante e mesclagem após login.
- Cadastro, login e recuperação de sessão por endpoints simulados.
- Área de perfil e histórico demonstrativo de pedidos.
- Checkout responsivo, com interfaces distintas para desktop e mobile e seleção visual de carteira.
- Criação de pedidos pela API simulada, com comprovante e ID retornado pela resposta HTTP.
- Eventos Socket.IO `nft.updated` para simular alterações de disponibilidade.
- Estados de carregamento, erro e resultados vazios em fluxos da interface.

## Como executar localmente

### Pré-requisitos

- Node.js e npm compatíveis com o Vite 8.
- Git.

```bash
git clone https://github.com/FellipeBordin/jungle-gaming-nft.git
cd jungle-gaming-nft
npm install
```

Crie o arquivo `.env.local` na raiz do projeto:

```env
VITE_ENABLE_MOCKS=true
VITE_SOCKET_URL=http://localhost:3001
```

**Terminal 1 — servidor de eventos (opcional):**

```bash
node server/socket.cjs
```

**Terminal 2 — frontend:**

```bash
npm run dev
```

Abra o endereço indicado pelo Vite, normalmente `http://localhost:5173`. O Socket.IO utiliza a porta `3001` por padrão.

O servidor Socket.IO é complementar: o catálogo, o login e a compra demonstrativa podem ser experimentados com o MSW mesmo sem um servidor real de pedidos. Para usar o Socket.IO hospedado, configure `VITE_SOCKET_URL` com a URL do serviço no ambiente correspondente.

## API simulada

Com `VITE_ENABLE_MOCKS=true`, o MSW intercepta as chamadas HTTP no navegador.

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| GET | `/api/nfts` | Listagem, busca, filtros e paginação |
| GET | `/api/nfts/:id` | Detalhes de um NFT |
| POST | `/api/auth/register` | Cadastro demonstrativo |
| POST | `/api/auth/login` | Login demonstrativo |
| GET | `/api/auth/me` | Recuperação da sessão |
| POST | `/api/orders` | Criação e confirmação de pedido demonstrativo |
| GET | `/api/orders?email=...` | Consulta demonstrativa de pedidos pelo e-mail |

As fixtures do catálogo ficam em `src/mocks/fixtures.ts`. Cadastros e pedidos são armazenados no `localStorage` do navegador; **não** constituem um banco de dados compartilhado ou uma autenticação segura de produção.

## Tempo real

O arquivo `server/socket.cjs` inicia um servidor Socket.IO que emite `nft.updated` periodicamente, simulando mudanças de disponibilidade. O cliente recebe os eventos em `src/realtime/SocketListener.tsx` e atualiza entradas específicas do cache do TanStack Query, verificando a versão dos dados.

O evento `order.updated` possui tratamento preparado no cliente, mas a emissão e o ciclo completo de atualização de pedidos ainda não foram implementados. A atualização do catálogo agregado também não cobre todas as chaves de cache utilizadas pelo marketplace.

## Testes e qualidade

Instale o navegador de testes, se necessário:

```bash
npm install
npx playwright install chromium
```

Execute todos os testes:

```bash
npx playwright test
```

**Última execução local informada: 18 testes aprovados**, sendo:

- **16 testes funcionais:** oito cenários executados em Chromium desktop e no perfil mobile Pixel 7.
- **2 testes de regressão visual:** captura e comparação da página inicial em desktop e mobile.

Os cenários funcionais incluem carregamento do catálogo, cadastro e login, detalhes de NFT, carrinho, navegação para checkout, ordenação, filtro Ethereum e compra completa com validação da resposta `POST /api/orders` e do modal de confirmação.

Para executar somente a regressão visual:

```bash
npx playwright test tests/visual.spec.ts
```

Para atualizar as imagens de referência **intencionalmente**, após uma alteração visual aprovada:

```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```

As imagens de referência estão versionadas em `tests/visual.spec.ts-snapshots/` e foram geradas em Windows; diferenças de sistema operacional, navegador e fontes podem afetar a comparação visual.

Outras verificações:

```bash
npm run lint
npm run build
```

O Playwright utiliza a configuração de `playwright.config.ts`, que inicia o frontend com os mocks habilitados. Os testes não realizam pagamentos reais.

### Lighthouse

Medições registradas anteriormente para a página inicial, **antes das alterações mais recentes** (não são uma nova auditoria da versão final):

| Ambiente | Performance | Acessibilidade | Boas práticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 97 | 99 | 100 | 100 |
| Desktop | 100 | 99 | 100 | 100 |

Esses números são resultados de medições pontuais e podem variar conforme ambiente, rede e versão publicada.

## Estrutura do projeto

```text
src/
├── components/       # Componentes reutilizáveis e ui/ (shadcn/ui)
├── contexts/         # Estado de autenticação e carrinho
├── hooks/            # Hooks de dados e contextos
├── mocks/            # Fixtures e handlers da API simulada
├── pages/            # Marketplace, detalhes, carrinho, checkout e perfil
├── realtime/         # Socket.IO e atualização de cache
├── routes/           # Rotas TanStack Router
├── services/         # Serviços HTTP e cliente Axios
└── types/            # Tipagens TypeScript
server/
└── socket.cjs        # Servidor de eventos Socket.IO
tests/
├── marketplace.spec.ts
├── visual.spec.ts
└── visual.spec.ts-snapshots/
public/
└── nfts/             # Imagens dos NFTs
```

## Limitações conhecidas

- Autenticação e cadastro são demonstrativos; dados de teste ficam no navegador e não devem utilizar credenciais reais.
- A escolha de carteira é visual; não há conexão blockchain, assinatura de transação ou transferência de ativos.
- A API simulada confirma pedidos sem implementar cotação autoritativa, reserva de estoque, idempotência ou todas as transições de status.
- O histórico de pedidos é consultado por e-mail na API simulada, sem autorização segura no servidor.
- Parte das requisições REST ainda utiliza `fetch` diretamente, em vez de passar pelo cliente Axios.
- As atualizações Socket.IO não cobrem integralmente o catálogo agregado nem o fluxo de status dos pedidos.
- Os testes de regressão visual cobrem a página inicial; ampliar a cobertura para outras telas e testar isolamento entre contas de forma automatizada são evoluções futuras.

Detalhes sobre responsabilidades, fluxo de dados, decisões técnicas e melhorias propostas estão em [ARCHITECTURE.md](./ARCHITECTURE.md).

## Autor

Desenvolvido por **Fellipe Bordin** como parte do desafio técnico da Jungle Gaming.
