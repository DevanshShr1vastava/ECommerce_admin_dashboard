import { useMutation, useQuery } from '@tanstack/react-query'
import { cartStore, ICartData, ICartProduct } from '../utils/AppStores'
import { deleteCart, getSingleCart, updateCart } from '../utils/CartAPI'
import { Button, Card, Col, Flex, Image, Row, Spin } from 'antd'
import { useEffect } from 'react'


const Cart = () => {
    const CartStore = cartStore()

    const {data, isLoading, isError, error, isFetched } = useQuery<ICartData>({
        queryKey : ["cart"],
        queryFn : getSingleCart,
        retry : false,
        refetchOnMount : false,
        refetchOnWindowFocus : false,
        staleTime : Infinity,
    });
   

    useEffect(()=>{
      if(isFetched && CartStore.cart.length === 0){
        CartStore.clearCart();
        data?.products.forEach((prod)=>CartStore.addTocart(prod));
      }
    },[])

    const { mutate: cartUpdate } = useMutation({
        mutationFn: updateCart,
        retry: false,
        onSuccess: (data) => {
          console.log("updated",data);
        },
    })

    const { mutate: clearCart } = useMutation({
        mutationFn: deleteCart,
        retry: false,
        onSuccess: () => {
          CartStore.clearCart();  
          alert('Cart Cleared Successfully');
        },
    })

    const handleUpdate = (product: ICartProduct, type : "add"|"remove"|"reduce") => {
        if(type === 'add'){
          const updatedProduct = {...product, quantity : product.quantity + 1};
          CartStore.updateCart(updatedProduct);
          cartUpdate(CartStore.cart);
        }
        else if(type === "reduce"){
          if(product.quantity > 1){
            const updatedCart = {...product, quantity : product.quantity - 1};
            CartStore.updateCart(updatedCart);
            cartUpdate(CartStore.cart);
          }
          else{
            CartStore.removeFromCart(product.id);
            cartUpdate(CartStore.cart);
          }
        }
        else{
          CartStore.removeFromCart(product.id);
          cartUpdate(CartStore.cart);
        }
    }
    if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;
    if(isError) return <h1>{error.message}</h1>

    return (
      <>
      <h2>Shopping cart</h2>
        <Row gutter={16} style={{ padding: "20px" }}>
        <Col span={18}>
        
          <Row gutter={[16, 16]}>
            {CartStore.cart.map((prod) => (
              <Col span={12} key={prod.id}>
                <Card loading={isLoading}>
                  <Flex justify="space-between" align="center">
                    <Image width={150} height={150} src={prod.thumbnail} />
                    <Flex vertical>
                      <p>{prod.title}</p>
                      <p>${prod.price}</p>
                      <p>Quantity: {prod.quantity}</p>
                      <p>Subtotal: ${prod.price * prod.quantity}</p>
                    </Flex>
                    <Flex vertical gap={10}>
                      <Button size="small" onClick={() => handleUpdate(prod, "add")}>+</Button>
                      <Button size="small" onClick={() => handleUpdate(prod, "reduce")}>-</Button>
                      <Button size="small" danger onClick={() => handleUpdate(prod, "remove")}>Remove</Button>
                    </Flex>
                  </Flex>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
        <Col span={6}>
          <Card style={{ textAlign: "center" }}>
            <h2>Total: ${Math.round(CartStore.cart.reduce((sum, prod) => sum + prod.price * prod.quantity, 0))}</h2>
            <Button type="primary" danger onClick={() => clearCart()}>Clear Cart</Button>
          </Card>
        </Col>
      </Row>
    </>
    );
}

export default Cart
