import React from 'react'
import { Avatar, Breadcrumb, Flex, Layout, Menu, Space, theme } from 'antd'
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle';
import { authToken, themeStore } from '../utils/AppStores';
import {  useQuery } from '@tanstack/react-query';
import { getCurrentUser, IAuthResponse } from '../utils/AuthAPI';



const {Header, Content, Footer } = Layout;

const menuItems = [
    { label: <Link to="/">Home</Link>, key: 'home' },
    { label: <Link to="/product">Products</Link>, key: 'products' },
    { label: <Link to="/cart">Cart</Link>, key: 'cart' },
    { label: <Link to="/orders">Orders</Link>, key: 'orders' },
    { label: <Link to="/users">Users</Link>, key: 'users' },
    { label: <Link to="/blogs">Blogs</Link>, key: 'blogs' },
    { label: <Link to="/logout">Logout</Link>, key: 'logout' },
]

const PageLayout = ({ children }: { children: React.ReactNode }) => {
    const ThemeStore = themeStore();

    const {
        token : {colorBgContainer, borderRadiusLG},
    } = theme.useToken();
    
    const token = authToken(state=>state.token);

    const result = useQuery<IAuthResponse>({
        queryKey : ['user',token],
        queryFn : ()=>getCurrentUser(token),
        retry : false,
        refetchOnWindowFocus : false,
        refetchOnMount : false
    });
    
    const location = useLocation();

    return (
        <Layout>
            <Header style = {{
                display : "flex",
                alignItems : 'center',
                backgroundColor : ThemeStore.dark ? '#001529' : "#fff",
                }}>
                
                <Menu 
                    mode = 'horizontal'
                    theme= {ThemeStore.dark ? 'dark' : 'light'}
                    items={menuItems}
                    style={{flex : 1, minWidth : 0}}
                    selectable={false}
                />
                <ThemeToggle />
            </Header>
            <Content style = {{padding : '0 48px',  minHeight : '91vh'}}>
                <Flex align='center' justify='space-between'>
                    <Breadcrumb style = {{margin : '16px 0'}}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>{location.pathname === '/' ? "Dashboard" : location.pathname.replace('/','')}</Breadcrumb.Item>
                    </Breadcrumb>
                    <div>
                        <Space>
                            <p>Welcome, {result.data?.firstName}</p>
                            <Avatar src={result.data?.image} />
                        </Space>
                    </div>
                </Flex>
                <div 
                    style = {{
                        background : colorBgContainer,
                        minHeight : 280,
                        padding : 24,
                        borderRadius : borderRadiusLG,

                    }}
                >
                    <main>{children}</main>
                </div>
                <Footer style={{textAlign:'center'}}>
                    Ecommerce Admin Dashboard Developed by Devansh Shrivastava
                </Footer>
            </Content>
        </Layout>
    );
}

export default PageLayout
