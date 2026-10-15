<div align="center">
  <h1>🐵 KURIO — NFT Marketplace</h1>
  <p><strong>Frontend Technical Challenge • Jungle Gaming</strong></p>
</div>

This project is a complete **NFT Marketplace** built with **React** and **TypeScript**, strictly following the visual identity defined in Figma for both Desktop and Mobile. It simulates a full Web3 ecosystem, focusing on visual fidelity, network resilience, and real-time updates.

---

### 📍 Why this Project?

This project was developed as part of the technical selection process for a **Frontend Developer** position at **Jungle Gaming**. The goal was to deliver a production-like marketplace with a premium user experience, solid architecture, and automated tests.

The main technical highlights include:

* **Asynchronous State Management & URL State:** Full integration between `@tanstack/react-router` and `@tanstack/react-query` via `axios`, ensuring that search, combined filters (collection, network, and price range), sorting, and pagination are reflected in the URL and preserved across page refreshes (`F5`) and browser history navigation.

* **Deterministic Network Simulation (MSW):** All business logic, including the catalog, authentication, favorites with optimistic updates, decimal ETH price calculations, coupon validation, and idempotent order creation, runs through the **Mock Service Worker (MSW)** interception layer. Data persists in the browser and works even in production on Vercel.

* **Real-Time Events (Socket.IO):** Reactive synchronization through `socket.io-client` for the `nft.updated` and `order.updated` events, using monotonic version control (`version`) to discard duplicate or out-of-order events and prevent purchases with outdated prices through `HTTP 409 Conflict` responses.

* **Responsive & Accessible Design System:** Styling built with **Tailwind CSS v4** and **shadcn/ui (Radix UI)**, adapted for Mobile (`390px`), Tablet (`768px`), and Desktop (`1440px`), featuring loading skeletons, keyboard navigation, focus management in modals and drawers, and accessible semantics.

* **End-to-End Testing:** An automated **Playwright** suite validates critical user flows, including Catalog, NFT Details, Cart with Coupons, Checkout, Receipt, and Account, across Desktop and Mobile Chromium.

<div align="center">

<img width="1440" alt="KURIO NFT Marketplace Preview" src="./Estilos%20Completos/In%C3%ADcio.png" />

</div>

---

### 🌐 View the project:
[View KURIO NFT Marketplace Online](jungle-gaming-kurio.vercel.app)

---

### 🔗 Project Link:
[Kurio — Jungle Gaming Frontend Challenge](https://github.com/CaioLeal/Kurio-Jungle-Gaming-Test)

---

### ⭐ How to use this project locally?

To run this project on your machine, you will need **Node.js 20+** and **npm** installed.

1. **Clone this repository:**
```bash
git clone https://github.com/CaioLeal/Kurio-Jungle-Gaming-Test.git
```
2. **Navigate to the project folder:**
```bash
cd Kurio-Jungle-Gaming-Test
```
3. **Install dependencies:**

> Use the `--legacy-peer-deps` flag for compatibility between MSW and the Socket.IO binding.

```bash
npm install --legacy-peer-deps
```
4. **Start the development server:**
```bash
npm run dev
```
5. **Open the application in your browser:** [http://localhost:5173/](http://localhost:5173/)

---

### 🧪 Build, Code Quality & E2E Testing

All scripts required for type checking, linting, production builds, and automated tests are configured in `package.json`.

**Development server:**
```bash
npm run dev
```

**Generate an optimized production build:**
```bash
npm run build
```

**Preview the production build locally:**
```bash
npm run preview
```

**TypeScript type checking:**
```bash
npm run typecheck
```

**Code quality audit with ESLint:**
```bash
npm run lint
```

**Install the Playwright browser (first execution only):**
```bash
npx playwright install chromium
```

**Run the complete E2E test suite (Desktop + Mobile Chromium):**
```bash
npx playwright test
```

**Open the interactive Playwright HTML report:**
```bash
npx playwright show-report
```

---

### 🔐 Demo Credentials & Evaluation Data

The application starts with an active collector session to simplify the evaluation process. You can also test **Login**, **Registration**, **User Switching**, and **Coupon** flows.

| Resource / Scenario | Credentials / Value | Expected Behavior |
| --- | --- | --- |
| **Main User** | Email: `contato@email.com` / Password: `12345678` | Authenticates the main account (`usr_1`) and restores favorites and wallets. |
| **Second User (Isolation)** | Email: `segundo@kurio.io` / Password: `12345678` | Authenticates an isolated account (`usr_2`) and clears the previous private cache. |
| **Invalid Credentials (HTTP 401)** | Any password shorter than 4 characters | Displays visual authentication error feedback in the modal or page. |
| **Registration Conflict (HTTP 409)** | Email: `conflito@kurio.io` | Simulates an email address that is already registered. |
| **Valid Promotional Coupon** | `KURIO10` or `AMOR10` | Applies a 10% discount to the cart subtotal through the API. |
| **Invalid / Expired Coupon** | Example: `EXPIRADO50` | Returns `HTTP 422 Unprocessable Entity` and displays an alert in the order summary. |

---

### 🔄 Testing Guide: Resetting Scenarios & Simulating Real-Time Events

MSW mocks keep a consistent state in `localStorage` under the key `kurio_msw_db_v1`, allowing page refreshes across all routes.

#### 1. Reset the Simulated Database

To restore the initial cart (with 3 NFTs), clear completed orders, and return the application to its original state, open the browser Developer Console (`F12`) and run one of the options below.

**Option A — Reset through the MSW REST API:**
```js
fetch('/api/test/reset', { method: 'POST' }).then(() => location.reload());
```

**Option B — Clear local storage directly:**
```js
localStorage.removeItem('kurio_msw_db_v1');
location.reload();
```

#### 2. Simulate Real-Time Price or Availability Updates (`nft.updated`)

To test an NFT price change while browsing or during the cart and checkout flows, open the Developer Console (`F12`) and dispatch the following Socket event:

```js
window.dispatchEvent(
  new CustomEvent('kurio:socket-event', {
    detail: {
      type: 'nft.updated',
      payload: {
        eventId: 'evt_' + Date.now(),
        nftId: '1',
        price: '1.49',
        available: 8,
        version: 2
      }
    }
  })
);
```

> Events with a `version` equal to or lower than the version already processed by the client are automatically discarded, ensuring idempotency on the frontend.

#### 3. Test a Non-Existent NFT (HTTP 404)

Navigate directly to the following route to test how the application handles a non-existent NFT and provides a way back to the catalog:

```text
http://localhost:5173/nft/999
```

---

### 🏛 Architecture & API Documentation

Detailed documentation covering the REST contracts (`/api/session`, `/api/nfts`, `/api/favorites`, `/api/cart`, `/api/orders`, `/api/profile`, and `/api/wallets`), cache invalidation strategies, checkout idempotency keys (`Idempotency-Key`), and local SVG asset replacement is available in [ARCHITECTURE.md](./ARCHITECTURE.md).

---

> [!IMPORTANT]
> 🚀 **Challenge Context:** This project was built for the Jungle Gaming Frontend Technical Challenge, with a focus on visual fidelity to the Figma design, resilient data flows, and automated test coverage.

### 🛠 Technologies Used:

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [Axios](https://axios-http.com/)
- [Socket.IO Client](https://socket.io/)
- [Mock Service Worker (MSW)](https://mswjs.io/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)
- [Playwright](https://playwright.dev/)

---

<div align="center">
  <p>Developed as part of the <strong>Jungle Gaming Frontend Technical Challenge</strong>.</p>
</div>