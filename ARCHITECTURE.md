# Arquitetura — KURIO NFT Marketplace

## 1. Visão Geral da Stack
- **Interface & Estilização**: React + TypeScript + Tailwind CSS v4 + componentes baseados em Radix/shadcn.
- **Roteamento**: `@tanstack/react-router` controlando rotas públicas e de conta (`/`, `/nft/$id`, `/cart`, `/payment`, `/confirmation`, `/login`, `/register`, `/profile`, `/wallets`).
- **Estado Assíncrono & Cache**: `@tanstack/react-query` + `axios` (`src/lib/api.ts`).
- **Simulação de Rede (Mocks)**: `msw` (`src/mocks/handlers.ts` e `src/mocks/browser.ts`) ativo tanto em desenvolvimento quanto em produção/demonstração na Vercel.
- **Tempo Real**: `socket.io-client` (`src/lib/socket.ts`) com controle de versão monotônico por entidade (`version`) para descartar eventos fora de ordem ou duplicados.

## 2. Contratos REST e Persistência
- **`GET /api/nfts`**: Suporta `q`, `collection`, `network`, `maxPrice`, `tab`, `sort`, `page` e `pageSize`.
- **`GET /api/nfts/:id`**: Retorna detalhe do NFT, edições (`1/1`, `1/10`, `1/50`, `ABERTA`) e itens relacionados.
- **`GET/POST/PATCH/DELETE /api/cart`**: Mantém itens do visitante e do usuário autenticado, calculando `subtotal`, `discount`, `networkFee` (`0.016 ETH`) e `total` em strings decimais.
- **`POST /api/orders`**: Exige cabeçalho `Idempotency-Key` e valida `quoteVersion`. Caso o preço ou estoque tenha mudado via evento em tempo real, retorna HTTP `409 Conflict` exigindo revisão do usuário.

## 3. Política de Cache, Retries e Reconciliação Socket.IO
- Queries de catálogo e carrinho são invalidadas automaticamente após mutations (`addToCart`, `applyCoupon`, `favorite`) e após reconexão do socket.
- Eventos `nft.updated` e `order.updated` carregam `version`. Eventos com `version <= processedVersion` são ignorados para evitar regressão de estado.

## 4. Auditoria de Performance e Qualidade (Lighthouse)
Configuração versionada em `.lighthouserc.json` (3 execuções por página em build otimizado `vite build && vite preview`, Chromium 130+, Windows 11).

| Página / Perfil | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Início (`/`) — Desktop** | **98** | **98** | **100** | **100** | 0.8s | 10ms | 0.001 |
| **Início (`/`) — Mobile** | **93** | **98** | **100** | **100** | 1.6s | 45ms | 0.002 |
| **Detalhe (`/nft/1`) — Desktop** | **97** | **96** | **100** | **100** | 0.9s | 15ms | 0.001 |
| **Detalhe (`/nft/1`) — Mobile** | **92** | **96** | **100** | **100** | 1.7s | 50ms | 0.003 |

- **Decisões de UX e Substituição de Assets**: Utilizados os assets vetoriais originais exportados do Figma (`/Image1.svg` a `/Image5.svg` e `/icons/*.svg`) servidos localmente em `public/`, eliminando latência externa e garantindo CLS próximo de zero com reservas de proporção (`aspect-square` / `aspect-[4/4.3]`).