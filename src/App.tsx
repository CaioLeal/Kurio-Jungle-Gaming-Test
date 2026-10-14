import { 
  Outlet, 
  RouterProvider, 
  createRouter, 
  createRoute, 
  createRootRoute 
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Home from './pages/Home'
import NftDetail from './pages/NftDetail'
import Cart from './pages/Cart'
import Payment from './pages/Payment'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Wallets from './pages/Wallets'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#120B07] text-[#F5EFEA]">
      <Outlet />
    </div>
  ),
})

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home })
const nftDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/nft/$id', component: NftDetail })
const cartRoute = createRoute({ getParentRoute: () => rootRoute, path: '/cart', component: Cart })
const paymentRoute = createRoute({ getParentRoute: () => rootRoute, path: '/payment', component: Payment })
const confirmationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/confirmation', component: OrderConfirmation })
const loginRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: Login })
const registerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/register', component: Register })
const profileRoute = createRoute({ getParentRoute: () => rootRoute, path: '/profile', component: Profile })
const walletsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/wallets', component: Wallets })

const routeTree = rootRoute.addChildren([
  indexRoute,
  nftDetailRoute,
  cartRoute,
  paymentRoute,
  confirmationRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  walletsRoute,
])

const router = createRouter({ routeTree })

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}