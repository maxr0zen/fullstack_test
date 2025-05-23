import Auth from "./pages/Auth"
import DevicePage from "./pages/DevicePage"
import Basket from "./pages/Basket"
import Shop from "./pages/Shop"
import Admin from "./pages/Admin"
import { BASKET_ROUTE, DEVICE_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, ADMIN_ROUTE } from "./utils/consts"

export const authRoutes = [
    {
        path: BASKET_ROUTE,
        Component: Basket,
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: DevicePage,
    },
    {
        path: ADMIN_ROUTE,
        Component: Admin,
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    }
]
