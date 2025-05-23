import React, { useContext } from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "../index";
import { SHOP_ROUTE, DEVICE_ROUTE } from '../utils/consts';
import Shop from '../pages/Shop';
import Favorites from '../pages/Favorites';
import ProductDetail from '../pages/ProductDetail';

const AppRouter = () => {
    const {user} = useContext(Context)
    console.log(user)
    return(
        <Routes>
            <Route path="/admin/*" element={<Navigate to="/admin/" replace />} />
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} element={<Component />} exact/>
            )}
            <Route path={SHOP_ROUTE} element={<Shop/>}/>
            <Route path="/favorites" element={<Favorites/>}/>
            <Route path={`${DEVICE_ROUTE}/:id`} element={<ProductDetail/>}/>
            <Route path="*" element={<Navigate to={SHOP_ROUTE}/>}/>
        </Routes>
    )
}

export default AppRouter;