Kurio NFT Marketplace
Marketplace demonstrativo de NFTs desenvolvido com React, TypeScript e Vite para um desafio técnico de desenvolvimento Front-End da Jungle Gaming.
A aplicação permite explorar colecionáveis digitais, pesquisar, filtrar e ordenar NFTs, visualizar detalhes, gerenciar um carrinho, criar uma conta e simular uma compra com confirmação de pedido. A interface é responsiva e utiliza uma API simulada para que os fluxos possam ser executados sem um backend de produção ou transações blockchain reais.
Demonstração
Aplicação: https://jungle-gaming-nft.vercel.app/

> **Importante:** este projeto é uma demonstração. Carteiras, autenticação e pagamentos são simulados; nenhum NFT é transferido e nenhuma criptomoeda é movimentada.
> Tecnologias
> Camada Tecnologias
> Interface React 19, TypeScript, Vite 8, Tailwind CSS 4, Lucide React
> Navegação TanStack Router
> Dados e cache TanStack Query, Axios
> API demonstrativa Mock Service Worker (MSW)
> Tempo real Socket.IO (cliente e servidor Node.js)
> Testes E2E Playwright
> Hospedagem Vercel (frontend) e Render (servidor Socket.IO)
> Funcionalidades
> Catálogo de NFTs com busca textual, filtros por rede, ordenação por preço e paginação.
> Página de detalhes com informações e disponibilidade de cada NFT.
> Carrinho com adição, remoção e alteração de quantidades.
> Cadastro, login e consulta de sessão por endpoints simulados.
> Área de perfil e histórico demonstrativo de pedidos.
> Checkout responsivo com seleção visual de carteira e validação de formulário.
> Criação de pedidos via API simulada, com confirmação e comprovante exibindo o ID retornado pela API.
> Atualizações simuladas de disponibilidade de NFTs por meio de eventos Socket.IO `nft.updated`.
> Tratamento de estados de carregamento, erros e respostas vazias em fluxos da interface.
> Executar localmente
> Pré-requisitos
> Node.js e npm compatíveis com o Vite 8.
> Git para clonar o repositório.

```bash
git clone https://github.com/FellipeBordin/jungle-gaming-nft.git
cd jungle-gaming-nft
npm install
```

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_ENABLE_MOCKS=true
VITE_SOCKET_URL=http://localhost:3001
```

Em um terminal, execute o servidor de eventos em tempo real:

```bash
node server/socket.cjs
```

Em outro terminal, inicie a interface:

```bash
npm run dev
```

A aplicação estará disponível no endereço indicado pelo Vite (normalmente `http://localhost:5173`). O servidor Socket.IO utiliza a porta `3001` por padrão.

> O Socket.IO é complementar: a API MSW permite experimentar o catálogo, a autenticação e o fluxo de compra sem um servidor de pedidos real.
> API simulada
> Com `VITE_ENABLE_MOCKS=true`, o MSW intercepta as chamadas HTTP realizadas no navegador.
> Método Endpoint Finalidade
> `GET` `/api/nfts` Lista NFTs com busca, rede, ordenação e paginação.
> `GET` `/api/nfts/:id` Consulta detalhes de um NFT.
> `POST` `/api/auth/register` Cadastra um usuário demonstrativo.
> `POST` `/api/auth/login` Autentica um usuário demonstrativo.
> `GET` `/api/auth/me` Consulta a sessão simulada.
> `POST` `/api/orders` Cria e confirma um pedido demonstrativo.
> `GET` `/api/orders?email=...` Retorna pedidos associados ao e-mail informado.
> As respostas do catálogo utilizam dados locais em `src/mocks/fixtures.ts`. Os cadastros e pedidos demonstrativos são armazenados no localStorage do navegador; não constituem um banco de dados nem oferecem persistência entre dispositivos.
> Tempo real
> O arquivo `server/socket.cjs` inicia um servidor Socket.IO que emite eventos `nft.updated` periodicamente, alterando a disponibilidade simulada de NFTs. O cliente recebe esses eventos em `src/realtime/SocketListener.tsx` e atualiza o cache do TanStack Query, respeitando a versão do NFT.
> Há um listener para `order.updated`, mas o fluxo completo de emissão e atualização de status de pedidos em tempo real ainda não foi implementado.
> Testes e verificações
> Instale as dependências e o navegador de testes, caso ainda não estejam disponíveis:

```bash
npm install
npx playwright install chromium
```

Execute os testes E2E:

```bash
npx playwright test
```

Os testes cobrem os seguintes cenários:
Carregamento da página inicial e exibição dos NFTs.
Cadastro de usuário e login.
Abertura dos detalhes de um NFT.
Inclusão de NFT no carrinho.
Navegação do carrinho até o checkout.
Ordenação por menor preço.
Filtro pela rede Ethereum.
Compra demonstrativa com validação da resposta da API e do modal de confirmação.
Outras verificações disponíveis:

```bash
npm run lint
npm run build
```

> O teste de compra utiliza o MSW e não efetua qualquer pagamento real. Para rodar Playwright, utilize a configuração do projeto em `playwright.config.ts`, que inicializa o frontend com os mocks habilitados.
> Organização do projeto

```text
src/
├── components/       # Componentes reutilizáveis e confirmação de pedidos
├── contexts/         # Estado de autenticação e carrinho
├── hooks/            # Hooks de acesso a dados e contextos
├── mocks/            # Fixtures e handlers da API simulada
├── pages/            # Marketplace, detalhes, carrinho, checkout e perfil
├── realtime/         # Integração Socket.IO e atualização de cache
├── routes/           # Rotas TanStack Router
├── services/         # Cliente Axios e serviços da aplicação
└── types/            # Tipagens TypeScript
server/
└── socket.cjs        # Servidor de eventos Socket.IO
public/
└── nfts/             # Imagens locais dos NFTs
```

Limitações conhecidas
O cadastro e a autenticação são mocks de demonstração, não adequados para produção; as credenciais simuladas são armazenadas localmente e não devem ser reutilizadas como senhas reais.
A escolha de carteira é visual. Não há conexão blockchain, assinatura de transações ou transferência de ativos.
A API simulada retorna pedidos confirmados; o ciclo completo de estados `pending`, `confirmed` e `rejected`, com atualização por `order.updated`, não está concluído.
Os dados da API demonstrativa não são compartilhados entre usuários ou dispositivos por um backend persistente.
Auditorias de desempenho (Lighthouse), snapshots visuais e eventuais melhorias de code splitting podem ser acrescentados como evolução.
Autor
Desenvolvido por Fellipe Bordin como parte do desafio técnico da Jungle Gaming.
