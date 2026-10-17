# Arquitetura — Kurio NFT Marketplace

## 1. Visão geral

O **Kurio NFT Marketplace** é uma aplicação demonstrativa de marketplace de NFTs desenvolvida para o desafio técnico de Front-End da Jungle Gaming. A interface React/TypeScript consome uma API simulada pelo MSW, mantém estados locais e recebe eventos demonstrativos via Socket.IO.

- **Aplicação:** https://jungle-gaming-nft.vercel.app/
- **Repositório:** https://github.com/FellipeBordin/jungle-gaming-nft
- **Instruções de execução:** [README.md](./README.md)

O sistema não executa pagamentos, assinaturas de carteira ou transferências reais em blockchain.

## 2. Stack e responsabilidades

| Tecnologia | Responsabilidade |
| --- | --- |
| React 19 e TypeScript | Componentes, tipagem e lógica da interface |
| Vite 8 | Desenvolvimento e build |
| Tailwind CSS 4 | Estilização e responsividade |
| shadcn/ui e Lucide React | Componentes reutilizáveis e ícones |
| TanStack Router | Rotas e navegação |
| TanStack Query | Cache, carregamento e atualização de dados |
| Axios | Cliente HTTP para os serviços que o utilizam |
| MSW | Interceptação HTTP e respostas simuladas |
| Socket.IO | Eventos de disponibilidade de NFTs |
| Playwright | Testes E2E e regressão visual em desktop e mobile |

## 3. Organização do código

```text
src/
├── components/       # Componentes compartilhados, incluindo ui/
├── contexts/         # Autenticação e carrinho
├── hooks/            # Hooks de acesso a dados e estados
├── mocks/            # Fixtures e handlers HTTP
├── pages/            # Telas e fluxos de usuário
├── realtime/         # Cliente Socket.IO e cache
├── routes/           # Configuração do TanStack Router
├── services/         # Serviços REST e Axios
└── types/            # Contratos TypeScript
server/
└── socket.cjs        # Servidor de eventos demonstrativos
tests/
├── marketplace.spec.ts
├── visual.spec.ts
└── visual.spec.ts-snapshots/
public/
└── nfts/             # Imagens do catálogo
```

A separação por responsabilidade mantém os componentes de apresentação distintos dos contextos de estado, das consultas e dos handlers simulados.

## 4. Inicialização e fluxo de dados

Em `src/main.tsx`, a aplicação inicializa o worker do MSW quando `VITE_ENABLE_MOCKS=true`, configura o TanStack Query e monta os provedores, o roteador e a integração de eventos.

```text
Interface React
├── TanStack Router → navegação
├── Contextos → sessão e carrinho
├── TanStack Query → consultas e cache
├── Serviços HTTP / chamadas REST → MSW → fixtures e handlers
└── Socket.IO → eventos → atualização/invalidação de cache
```

O cliente Axios é utilizado em serviços de API, mas partes do catálogo e dos detalhes ainda usam `fetch` diretamente. A centralização de todas as chamadas REST no Axios é uma melhoria pendente.

## 5. API demonstrativa (MSW)

| Método | Endpoint | Uso |
| --- | --- | --- |
| GET | `/api/nfts` | Catálogo, busca, filtros e paginação |
| GET | `/api/nfts/:id` | Detalhes de NFT |
| POST | `/api/auth/register` | Cadastro |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Recuperação de sessão |
| POST | `/api/orders` | Criação de pedido demonstrativo |
| GET | `/api/orders?email=...` | Histórico filtrado por e-mail |

As fixtures ficam em `src/mocks/fixtures.ts`. Os dados demonstrativos de cadastro e pedidos são armazenados no `localStorage` e não são compartilhados por um backend persistente.

## 6. Autenticação e persistência do carrinho

O contexto de autenticação mantém o usuário da sessão e utiliza um token demonstrativo no `localStorage`. Ao atualizar a página, tenta recuperar a sessão por `GET /api/auth/me`.

O contexto do carrinho utiliza chaves locais separadas para visitantes e para cada identificador de usuário:

- O visitante mantém o carrinho após atualizar a página.
- No login, os itens do visitante são mesclados ao carrinho da conta autenticada, respeitando os limites de disponibilidade.
- Ao alternar entre contas no mesmo navegador, cada usuário recupera seu próprio carrinho.

Esse isolamento é **local e demonstrativo**. Não substitui autenticação e autorização no servidor. O histórico de pedidos filtrado por e-mail também não implementa controle de acesso seguro para produção.

## 7. Carrinho, checkout e pedidos

O carrinho permite adicionar, remover e alterar quantidades, calcular o total e persistir os itens. O checkout possui interfaces distintas para desktop e mobile e exige o preenchimento dos dados necessários à criação do pedido.

O fluxo demonstrativo envia os itens para `POST /api/orders` e, quando a resposta indica `confirmed`, apresenta um modal com o ID retornado pela API.

O total exibido é calculado no cliente. Uma implementação de produção exigiria cotação e validação autoritativas de preço e estoque, autorização, idempotência, controle de concorrência e tratamento de erros transacionais.

A seleção de carteira é apenas visual; não existe pagamento ou transferência real de NFTs.

## 8. Eventos em tempo real

O servidor `server/socket.cjs` emite periodicamente `nft.updated` com identificador, versão, disponibilidade e data da atualização. O listener `src/realtime/SocketListener.tsx` compara versões antes de atualizar entradas específicas do cache do TanStack Query.

Limitações:

- O servidor demonstrativo não emite `order.updated`, embora o cliente possua tratamento preparado para esse evento.
- A consulta agregada do marketplace utiliza uma chave de cache diferente de algumas chaves tratadas pelo listener; por isso, nem todas as visualizações são atualizadas imediatamente.
- Os eventos demonstram integração em tempo real, não uma fonte autoritativa de estoque ou pedidos.

## 9. Interface, responsividade e acessibilidade

A interface utiliza Tailwind CSS, componentes reutilizáveis e shadcn/ui. Os fluxos incluem estados de carregamento, erro e conteúdo vazio.

Foram realizadas medições Lighthouse na página inicial, antes das alterações mais recentes:

| Ambiente | Performance | Acessibilidade | Boas práticas | SEO |
| --- | ---: | ---: | ---: | ---: |
| Mobile | 97 | 99 | 100 | 100 |
| Desktop | 100 | 99 | 100 | 100 |

Os resultados são pontuais e não equivalem a uma nova auditoria da versão final. Navegação por teclado, rótulos, contraste e foco devem continuar sendo avaliados à medida que a interface evolui.

## 10. Testes e qualidade

O Playwright está configurado em `playwright.config.ts` para executar os testes com MSW em dois projetos:

- `chromium`: Desktop Chrome.
- `mobile-chrome`: perfil Pixel 7 utilizando Chromium.

Na última execução local informada, **18 testes passaram**:

| Suíte | Desktop | Mobile | Total |
| --- | ---: | ---: | ---: |
| Fluxos funcionais | 8 | 8 | 16 |
| Regressão visual da página inicial | 1 | 1 | 2 |
| **Total** | **9** | **9** | **18** |

Os testes funcionais verificam carregamento, cadastro/login, detalhes de NFT, carrinho, checkout, ordenação, filtro por rede e compra confirmada pela API. O teste visual utiliza `toHaveScreenshot` com imagens de referência versionadas em `tests/visual.spec.ts-snapshots/`.

```bash
npm install
npx playwright install chromium
npx playwright test
npx playwright test tests/visual.spec.ts
npm run lint
npm run build
```

As referências visuais foram geradas em Windows; diferenças de ambiente podem afetar a comparação. Os testes não realizam pagamentos reais. Persistência e isolamento entre contas foram também verificados manualmente; ainda não há testes automatizados específicos desses cenários.

## 11. Ambiente e implantação

O frontend está hospedado na Vercel e o servidor Socket.IO demonstrativo, no Render.

```env
VITE_ENABLE_MOCKS=true
VITE_SOCKET_URL=http://localhost:3001
```

```bash
npm install
node server/socket.cjs
# Em outro terminal:
npm run dev
```

Em produção, `VITE_SOCKET_URL` deve apontar para o serviço Socket.IO do ambiente. O frontend permanece utilizável com os endpoints MSW mesmo sem conexão com o servidor de eventos.

## 12. Limitações e próximos passos

- Centralizar todas as chamadas REST no Axios e padronizar o tratamento de erros.
- Integrar a consulta agregada do catálogo às atualizações do Socket.IO.
- Implementar `order.updated` e transições de status de pedidos.
- Adicionar cotação, validação autoritativa de preço/estoque, cupons e idempotência.
- Proteger histórico de pedidos e sessões com autenticação/autorização reais.
- Não armazenar credenciais reais nos mocks locais.
- Ampliar os testes automatizados para persistência, isolamento entre contas, falhas de API e outras telas visuais.
- Avaliar code splitting e otimizações adicionais com novas medições.

## 13. Decisões arquiteturais

O MSW permite executar e testar fluxos sem depender de um backend de produção. O TanStack Query gerencia consultas e cache, enquanto os contextos React mantêm estados da sessão e do carrinho. O Socket.IO demonstra a recepção de eventos, e o Playwright valida fluxos completos e estabilidade visual em dois tamanhos de tela.

O objetivo é demonstrar competências de Front-End, integração com APIs, gerenciamento de estado, responsividade, testes e organização do código, mantendo as limitações explicitamente documentadas.
