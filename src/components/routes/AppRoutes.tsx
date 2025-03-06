import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Logout from '../pages/Logout'
import Dashboard from '../pages/Dashboard'

import UserAuth from './UserAuth'

import Product from '../pages/Product'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import User from '../pages/User'
import UserDetail from '../pages/UserDetail'
import Orders from '../pages/Orders'
import Blogs from '../pages/Blogs'
import BlogDetail from '../pages/BlogDetail'
import { authToken } from '../utils/AppStores'
import EditProduct from '../pages/EditProduct'
import AddProduct from '../pages/AddProduct'
import UserEdit from '../pages/UserEdit'


const AppRoutes = () => {
    const token = authToken(state=>state.token);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />

            <Route
                path="/"
                element={
                    token ? (
                        <Dashboard />
                    ) : (
                        <Navigate to="/login" replace />
                    )
                }
            />

            <Route element={<UserAuth isUserAuth={!!token} />}>
                <Route path="/product" element={<Product />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path ="/product/add" element = {<AddProduct />} />
                <Route path ="/editProduct/:id" element ={<EditProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/users" element={<User />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/users/edit/:id" element={<UserEdit />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetail />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
