import { useNavigate, useParams } from 'react-router-dom'
import { cartStore, ICartProduct, productStore } from '../utils/AppStores'
import { Button, Card, Carousel, Descriptions, Flex, Image } from 'antd'
import type { DescriptionsProps } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { updateCart } from '../utils/CartAPI';


const ProductDetail = () => {
    const { id } = useParams()

    const productData = productStore((state) => state.product)

    const productDetails = productData.find(
        (product) => product.id === Number(id)
    )
    const items: DescriptionsProps['items'] = [
      {
        key: '1',
        label: 'Description',
        children: productDetails?.description,
      },
      {
        key: '2',
        label: 'Category',
        children: productDetails?.category,
      },
      {
        key: '3',
        label: 'Price',
        children: `$${productDetails?.price?.toFixed(2)}`,
      },
      {
        key: '4',
        label: 'Rating',
        children: productDetails?.rating,
      },
      {
        key: '5',
        label: 'Stock',
        children: productDetails?.stock,
      },
      {
        key: '6',
        label: 'Brand',
        children: productDetails?.brand,
      },
      {
        key: '7',
        label: 'Minimum Order Quantity',
        children: productDetails?.minimumOrderQuantity,
      },
    ]
    const CartStore = cartStore();
    const { mutate: cartAdd } = useMutation({
      mutationFn: (updatedCart: ICartProduct) => updateCart([updatedCart]),
      retry: false,
      onSuccess: (data) => {
        console.log("added",data);
      },
  })
  const navigate = useNavigate();
    const handleClick = ()=>{
      if(productDetails){
        const newProduct = {
          id: productDetails.id,
          title: productDetails.title,
          price: productDetails.price,
          brand : productDetails.brand,
          quantity: 1,
          total: productDetails.price,
          thumbnail: productDetails.thumbnail,
          discountedPercentage: productDetails.discountPercentage,
          discountedTotal: 60,
        };
        CartStore.addTocart(newProduct);
        cartAdd({...newProduct, quantity : 1});
        navigate('/cart');
      }
    }

    return (
        <>
            <Card title={productDetails?.title}>
                <Flex justify="space-between">
                    <Image.PreviewGroup>
                        <Carousel
                            autoplay
                            autoplaySpeed={4000}
                            style={{ width: 300 }}
                        >
                            {productDetails?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '250px',
                                        overflow: 'hidden',
                                        objectFit :'contain'
                                    }}
                                >
                                    <Image
                                        width={250}
                                        src={image}
                                        alt="product-image"
                                    />
                                </div>
                            ))}
                        </Carousel>
                        </Image.PreviewGroup>
                        <Flex vertical align ="flex-end" justify='space-between' style={{padding:32}}>
                          <Descriptions title="Product Info" items= {items} />
                          <Button type="default" onClick={handleClick}>Add to Cart</Button>
                        </Flex>
                </Flex>
            </Card>
        </>
    )
}

export default ProductDetail
