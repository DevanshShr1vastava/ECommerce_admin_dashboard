import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

import {  Button, Flex, Form, Input, InputNumber,  notification,  Select } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { addProduct, getAllCategories } from '../utils/ProductAPI'

import * as yup from 'yup'
import { useNavigate } from 'react-router'
import { IProduct, productStore } from '../utils/AppStores'

const { Option } = Select

const addFormSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    price: yup
        .number()
        .typeError('Price must be a number')
        .positive('Price must be greater than 0')
        .required('Price is required'),
    rating: yup
        .number()
        .min(0)
        .max(5, 'Rating must be between 0 and 5')
        .required('Rating is required'),
    stock: yup
        .number()
        .min(0, "Stock can't be negative")
        .required('Stock is required'),
    brand: yup.string().required('Brand is required'),
    minimumOrderQuantity: yup
        .number()
        .min(1, 'Minimum order must be at least 1')
        .required('Minimum order is required'),
    images: yup
        .array()
        .of(yup.object().shape({ value: yup.string().required() }))
        .min(1, 'At least one image is required')
        .default([{ value: '' }]),
})

export interface IProductFormValues {
    title: string
    description: string
    category: string
    price: number
    rating: number
    stock: number
    brand: string
    minimumOrderQuantity: number
    images: { value: string }[]
}

const AddProduct = () => {
    
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<IProductFormValues>({
        resolver: yupResolver(addFormSchema),
        defaultValues: {
            title: '',
            description: '',
            category: '',
            price: 0,
            rating: 0,
            stock: 0,
            brand: '',
            minimumOrderQuantity: 1,
            images: [{ value: '' }] as { value: string }[],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'images',
    })

    const navigate = useNavigate()
    const ProductStore = productStore()
    const { data: CategoryData } = useQuery({
        queryKey: ['category'],
        queryFn: getAllCategories,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
    const { mutate } = useMutation({
        mutationFn: (data: IProduct) => addProduct(data),
        retry: false,
        onSuccess: (data) => {
            notification.success({
                message : "Success",
                description : "Product added successfully",
                duration : 0
            })
            navigate('/product')
            console.log(JSON.stringify(data))
        },
    })

    const onSubmit = (data: IProductFormValues) => {
        const dataToSend: IProduct = {
            ...data,
            images: data.images.map((image) => image.value),
            id: Number(ProductStore.product.length + 2),
            tags: [],
            brand: '',
            sku: '',
            weight: 0,
            dimensions: {
                width: 0,
                height: 0,
                depth: 0,
            },
            warrantyInformation: '',
            shippingInformation: '',
            discountPercentage: 0,
            availabilityStatus: '',
            reviews: [],
            returnPolicy: '',
            meta: {
                createdAt: '',
                updatedAt: '',
                barcode: '',
                qrCode: '',
            },
            thumbnail: '',
        }
        console.log(dataToSend)
        mutate(dataToSend)
        ProductStore.addProduct(dataToSend)
    }

    return (
        <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
            <Form.Item
                label="Title"
                validateStatus={errors.title ? 'error' : ''}
                help={errors.title?.message}
            >
                <Controller
                    name="title"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Description"
                validateStatus={errors.description ? 'error' : ''}
                help={errors.description?.message}
            >
                <Controller
                    name="description"
                    control={control}
                    render={({ field }) => <Input.TextArea {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Category"
                validateStatus={errors.category ? 'error' : ''}
                help={errors.category?.message}
            >
                <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                        <Select {...field}>
                            {CategoryData?.map((category: string) => (
                                <Option key={category} value={category}>
                                    {category}
                                </Option>
                            ))}
                        </Select>
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Brand"
                validateStatus={errors.brand ? 'error' : ''}
                help={errors.brand?.message}
            >
                <Controller
                    name="brand"
                    control={control}
                    render={({ field }) => <Input {...field} />}
                />
            </Form.Item>

            <Form.Item
                label="Rating"
                validateStatus={errors.rating ? 'error' : ''}
                help={errors.rating?.message}
            >
                <Controller
                    name="rating"
                    control={control}
                    render={({ field }) => (
                        <InputNumber {...field} style={{ width: '100%' }} />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Price"
                validateStatus={errors.price ? 'error' : ''}
                help={errors.price?.message}
            >
                <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                        <InputNumber {...field} style={{ width: '100%' }} />
                    )}
                />
            </Form.Item>

            <Form.Item
                label="Stock"
                validateStatus={errors.stock ? 'error' : ''}
                help={errors.stock?.message}
            >
                <Controller
                    name="stock"
                    control={control}
                    render={({ field }) => (
                        <InputNumber {...field} style={{ width: '100%' }} />
                    )}
                />
            </Form.Item>

            {fields.map((field, index) => (
                <Form.Item key={field.id} label={`Image URL ${index + 1}`}>
                    <Controller
                        name={`images.${index}.value`}
                        control={control}
                        render={({ field }) => <Input {...field} />}
                    />
                    
                    <Button htmlType="button" onClick={() => remove(index)}>
                        Remove
                    </Button>
                    
                </Form.Item>
            ))}
            <Flex justify='flex-end'>
            <Button htmlType="button" onClick={() => append({ value: '' })}>
                Add Image
            </Button>
            </Flex>
            <Form.Item style={{paddingTop:22}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default AddProduct
