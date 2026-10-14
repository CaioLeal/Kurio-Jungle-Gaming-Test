<div align="center">
  <h1>🐵 KURIO — NFT Marketplace</h1>
  <p><strong>Desafio Técnico Frontend • Jungle Gaming</strong></p>
</div>

---

### 📍 Por que este Projeto? (Contexto)

Este projeto foi desenvolvido como parte do processo seletivo técnico para uma vaga de **Frontend Developer na Jungle Gaming**. O objetivo principal foi construir a **KURIO**, uma plataforma completa de Marketplace de NFTs em **React** e **TypeScript**, seguindo rigorosamente a identidade visual definida no Figma (em versões Desktop e Mobile) e simulando um ecossistema Web3 completo com alta fidelidade visual, resiliência de rede e atualizações em tempo real.

Os principais diferenciais técnicos e arquiteturais desta aplicação incluem:

- **Gerenciamento de Estado Assíncrono & URL State:** Integração completa entre `@tanstack/react-router` e `@tanstack/react-query` via `axios`, garantindo que busca, filtros combinados (coleção, rede e faixa de preço), ordenação e paginação componham o estado da URL e sobrevivam a *refresh* (F5) e navegação pelo histórico.
- **Camada de Rede Simulada (MSW) Determinística:** Toda a lógica de negócio (catálogo, autenticação, favoritos com *optimistic updates*, cálculo de cotações em ETH decimal, validação de cupons e criação idempotente de pedidos) roda interceptada na camada de rede pelo **Mock Service Worker (MSW)**, persistindo no navegador e funcionando inclusive no ambiente de produção (Vercel).
- **Eventos em Tempo Real (Socket.IO):** Sincronização reativa via `socket.io-client` para os eventos `nft.updated` e `order.updated`, com controle de versão monotônico (`version`) para descartar eventos duplicados ou fora de ordem e impedir finalização de compra com cotação desatualizada (HTTP `409 Conflict`).
- **Design System Responsivo & Acessível:** Estilização construída com **Tailwind CSS v4** e **shadcn/ui (Radix UI)**, adaptada para viewports Mobile (`390px`), Tablet (`768px`) e Desktop (`1440px`), contando com *skeletons* de carregamento, navegação por teclado, controle de foco em modais/drawers e semântica acessível.
- **Qualidade Garantida com Testes E2E:** Suíte automatizada com **Playwright** validando os fluxos críticos de ponta a ponta (Catálogo, Detalhes, Carrinho com Cupom, Checkout, Recibo e Conta) nos perfis Desktop e Mobile Chromium.

<div align="center">
  <!-- Dica: Substitua o link abaixo por um print da sua tela Início no GitHub após subir o repositório -->
  <img width="1440" alt="KURIO NFT Marketplace Preview" src="./Estilos%20Completos/Início.png" />
</div>

---

### 🌐 Veja o projeto online (Deploy Vercel):
[Acessar KURIO NFT Marketplace Online](https://kurio-jungle-gaming-test.vercel.app/) *(atualize com a URL final gerada pela sua Vercel)*

### 🔗 Link do Repositório:
[Kurio — Jungle Gaming Frontend Challenge](https://github.com/CaioLeal/Kurio-Jungle-Gaming-Test)

---

### ⭐ Como executar este projeto localmente?

Requisitos: **Node.js 20+** e **npm**.

1. **Clone este repositório:**
```bash
git clone [https://github.com/CaioLeal/Kurio-Jungle-Gaming-Test.git](https://github.com/CaioLeal/Kurio-Jungle-Gaming-Test.git)
cd Kurio-Jungle-Gaming-Test