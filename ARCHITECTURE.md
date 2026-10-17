Arquitetura — Kurio NFT Marketplace

1. Visão geral
   O Kurio NFT Marketplace é uma aplicação demonstrativa de marketplace de NFTs desenvolvida como desafio técnico de Front-End para a Jungle Gaming. O projeto utiliza React e TypeScript, com uma API simulada no navegador, para permitir a exploração do catálogo, a autenticação demonstrativa, o gerenciamento do carrinho e a simulação de pedidos.
   Demonstração: https://jungle-gaming-nft.vercel.app/
   Repositório: https://github.com/FellipeBordin/jungle-gaming-nft
   O sistema é uma demonstração: não realiza pagamentos, assinaturas de carteira ou transferências reais de NFTs em blockchain.

2. Stack e responsabilidades
   Tecnologia Responsabilidade
   React 19 e TypeScript Componentes, tipagem e lógica da interface
   Vite 8 Ambiente de desenvolvimento e build de produção
   Tailwind CSS 4 Estilização responsiva
   shadcn/ui Componentes reutilizáveis de interface, incluindo botões de compra
   Lucide React Ícones da interface
   TanStack Router Navegação e organização das rotas
   TanStack Query Cache, carregamento e atualização de dados assíncronos
   Axios Cliente HTTP dos serviços REST que o utilizam
   Mock Service Worker (MSW) Interceptação de requisições e simulação da API
   Socket.IO Recepção de eventos demonstrativos em tempo real
   Playwright Testes automatizados de ponta a ponta (E2E)

3. Organização do código
   src/
   ├── components/ # Componentes reutilizáveis, incluindo ui/
   ├── contexts/ # Autenticação e estado do carrinho
   ├── hooks/ # Hooks para contextos e dados
   ├── mocks/ # Fixtures e handlers HTTP do MSW
   ├── pages/ # Páginas e fluxos da aplicação
   ├── realtime/ # Cliente Socket.IO e atualização do cache
   ├── routes/ # Configuração do TanStack Router
   ├── services/ # Cliente HTTP e serviços de API
   └── types/ # Tipos e contratos TypeScript
   server/
   └── socket.cjs # Servidor demonstrativo de eventos
   public/
   └── nfts/ # Imagens locais dos colecionáveis
   A separação por responsabilidade facilita a manutenção: páginas compõem a interface; componentes concentram elementos reutilizáveis; contextos controlam estados compartilhados; serviços concentram parte das chamadas HTTP; e mocks simulam as respostas da API.
4. Inicialização e fluxo de dados
   Em src/main.tsx, a aplicação:
5. Verifica VITE_ENABLE_MOCKS; quando definido como true, inicializa o worker do MSW antes de renderizar a interface.
6. Inicializa o QueryClient do TanStack Query, com staleTime de 60 segundos, uma tentativa de repetição e sem atualização automática ao focar a janela.
7. Monta os provedores de cache, autenticação e carrinho, além do roteador.
8. Inicializa o listener de eventos Socket.IO.
   Fluxo simplificado:
   Interface React
   ├── TanStack Router → navegação
   ├── Contextos → autenticação e carrinho
   ├── TanStack Query → cache de consultas
   ├── Serviços HTTP / requisições REST
   │ └── MSW → handlers e dados demonstrativos
   └── Socket.IO → eventos → atualização/invalidação de cache
   Observação: parte das requisições do catálogo e da página de detalhes ainda utiliza fetch diretamente, enquanto os serviços de autenticação utilizam Axios. Portanto, a centralização de todas as chamadas REST em Axios ainda é uma melhoria pendente.
9. API simulada com MSW
   O MSW intercepta requisições HTTP no navegador e responde usando fixtures e handlers locais. Isso permite testar os fluxos sem depender de uma API de produção.
   Método Endpoint Uso
   GET /api/nfts Listagem, busca, filtros e paginação
   GET /api/nfts/:id Detalhes de um NFT
   POST /api/auth/register Cadastro demonstrativo
   POST /api/auth/login Login demonstrativo
   GET /api/auth/me Recuperação da sessão
   POST /api/orders Criação de pedido demonstrativo
   GET /api/orders?email=... Consulta demonstrativa de pedidos

As fixtures do catálogo ficam em src/mocks/fixtures.ts. Cadastros e pedidos simulados são armazenados no localStorage do navegador. Esses dados não constituem um banco de dados compartilhado entre dispositivos.

6. Autenticação e isolamento de carrinhos
   O AuthProvider mantém o usuário autenticado em memória e utiliza um token demonstrativo no localStorage. Ao recarregar a página, tenta recuperar a sessão pelo endpoint /api/auth/me.
   O CartProvider mantém os itens e as quantidades, com persistência local. O armazenamento é separado por identificador do usuário; visitantes usam uma chave própria. No login, os itens do carrinho de visitante são mesclados aos da conta autenticada, respeitando o limite de disponibilidade informado no NFT. Ao alternar entre contas, cada usuário recupera seu próprio carrinho.
   Essas medidas evitam a mistura de carrinhos na interface do mesmo navegador, mas não substituem autorização no servidor. O endpoint demonstrativo de histórico de pedidos utiliza e-mail como filtro e não oferece isolamento seguro para um ambiente de produção.
7. Carrinho e checkout
   O carrinho oferece adição e remoção de NFTs, alteração de quantidade, cálculo de total e persistência após atualização da página. O checkout utiliza uma API simulada para criar pedidos e apresenta a confirmação com o identificador retornado.
   O valor total exibido é calculado no cliente a partir dos preços presentes nos itens. Uma implementação de produção exigiria validação de preço e estoque no servidor, cálculo autoritativo do pedido, autenticação/autorização, idempotência e tratamento de concorrência antes da confirmação de compra.
   A seleção de carteira e o pagamento são demonstrativos: não há conexão blockchain ou transferência real de ativos.
8. Eventos em tempo real
   O servidor em server/socket.cjs emite periodicamente eventos nft.updated, contendo identificador, versão e disponibilidade do NFT. O componente src/realtime/SocketListener.tsx recebe esses eventos e procura atualizar entradas do cache do TanStack Query.
   A atualização compara a versão recebida com a versão armazenada, evitando substituir um NFT por dados mais antigos. O listener também está preparado para receber order.updated e invalidar consultas de pedidos.
   Limitações atuais: o servidor demonstrativo não emite order.updated. Além disso, a consulta agregada do catálogo utiliza uma chave de cache diferente das chaves tratadas pelo listener; por isso, nem todas as visualizações do marketplace recebem necessariamente a atualização em tempo real sem nova consulta.
9. Interface, responsividade e acessibilidade
   A interface utiliza Tailwind CSS para adaptação a diferentes tamanhos de tela, componentes React reutilizáveis e elementos do shadcn/ui. Os fluxos incluem estados de carregamento, erros e mensagens de interface. A aplicação foi submetida a auditorias Lighthouse nas versões mobile e desktop.
   Os componentes e fluxos devem continuar sendo avaliados quanto a navegação por teclado, rótulos acessíveis, contraste, estados de foco e experiência em telas pequenas.
10. Testes e qualidade
    O projeto possui testes E2E com Playwright, incluindo navegação, autenticação, detalhes dos NFTs, carrinho, filtros, ordenação e compra demonstrativa. A configuração atual executa os testes no Chromium desktop e utiliza o MSW durante a execução.
    Comandos de validação:
    npm run lint
    npm run build
    npx playwright test
    Os testes existentes passaram após a integração do shadcn/ui e a implementação da persistência do carrinho. Testes automatizados específicos de múltiplos usuários, projetos mobile no Playwright e baselines de regressão visual ainda podem ser ampliados.
11. Ambiente e implantação
    O frontend é publicado na Vercel. O servidor demonstrativo Socket.IO é hospedado no Render.
    Variáveis utilizadas:
    VITE_ENABLE_MOCKS=true
    VITE_SOCKET_URL=http://localhost:3001
    Para executar localmente:
    npm install
    node server/socket.cjs
    Em outro terminal:
    npm run dev
    O endereço do Socket.IO deve ser ajustado conforme o ambiente. O frontend funciona com os endpoints simulados do MSW mesmo quando o servidor de eventos não está disponível.
12. Limitações e próximos passos

- Centralizar todas as chamadas REST no cliente Axios e padronizar o tratamento de erros.
- Integrar o catálogo agregado às atualizações do Socket.IO.
- Implementar emissão e tratamento completos de order.updated, com transições de status.
- Criar uma API de cotação e validação autoritativa de preço, estoque, cupom e idempotência.
- Proteger o histórico de pedidos por identidade autenticada no servidor.
- Substituir a autenticação demonstrativa por uma solução segura; os dados locais de teste não devem conter credenciais reais.
- Ampliar os testes Playwright para mobile, persistência, isolamento entre usuários e regressão visual.
- Considerar divisão de código por rota e outras otimizações conforme novas medições de desempenho.

13. Decisões arquiteturais
    O MSW foi escolhido para permitir uma experiência funcional e testável sem backend de produção. O TanStack Query concentra o cache das consultas assíncronas, enquanto os contextos React mantêm estados da sessão e do carrinho. O Socket.IO demonstra a integração orientada a eventos. A separação entre componentes, páginas, serviços e mocks permite substituir gradualmente as implementações simuladas por serviços reais.
    O objetivo do projeto é demonstrar competências de desenvolvimento Front-End, integração de APIs, gerenciamento de estado, responsividade, testes e organização de código, com limitações técnicas explicitamente documentadas.
