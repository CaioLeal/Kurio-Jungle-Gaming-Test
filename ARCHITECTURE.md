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