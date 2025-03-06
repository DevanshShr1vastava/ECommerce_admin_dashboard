import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { getAllProducts } from './ProductAPI'
import { getAllUsers } from './AuthAPI'
import { getAllCarts } from './CartAPI'


export interface IThemeStore {
    dark: boolean
    toggleTheme: () => void
}

export const themeStore = create<IThemeStore, [['zustand/persist', unknown]]>(
    persist(
        (set) => ({
            dark: false,
            toggleTheme: () =>
                set((state) => ({
                    dark: !state.dark,
                })),
        }),
        {
            name: 'themeStorage',
        }
    )
)

interface IAuthToken {
    token: string | null
    setToken: (UserToken: string | null) => void
}

export const authToken = create<IAuthToken, [['zustand/persist', unknown]]>(
    persist(
        (set) => ({
            token: null,
            setToken: (UserToken) => set({ token: UserToken }),
        }),
        {
            name: 'token-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
export interface ICartData {
    id: number;
    products: ICartProduct[];
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
  }
  
export interface ICartProduct {
    id: number;
    title: string;
    price: number;
    quantity: number;
    total: number;
    discountedPercentage: number;
    discountedTotal: number;
    thumbnail: string;
  }

interface ICartStore {
    cart: ICartProduct[],
    addTocart  : (cartProduct : ICartProduct) => void;
    updateCart : (updatedProduct : ICartProduct) => void;
    clearCart : () => void;
    removeFromCart : (productId : number) => void;
}

export const cartStore = create<ICartStore, [['zustand/persist', unknown]]>(
    persist(
        (set) => ({
            cart: [],
            addTocart  : (cartProduct : ICartProduct) => set((state)=>{
                const existingProduct = state.cart.find((prod)=> prod.id === cartProduct.id);
                if(existingProduct){
                    return {
                        cart : state.cart.map((prod)=>
                        prod.id === cartProduct.id ? {...prod, quantity: prod.quantity + 1} : prod),
                    }
                }
                return {
                    cart : [...state.cart, {...cartProduct, quantity : 1}]
                }
            }),
            updateCart : (updatedProduct : ICartProduct) => set((state)=>({
                cart : state.cart.map((prod)=>prod.id === updatedProduct.id? updatedProduct : prod)   
            })),
            removeFromCart : (productId : number) => set((state)=>({
                cart : state.cart.filter((prod)=> prod.id !== productId)
            })),
            clearCart : () => set({
                cart : []
            }),
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

interface IReview {
    rating: number
    comment: string
    date: string
    reviewerName: string
    reviewerEmail: string
}

export interface IProduct {
    id: number
    title: string
    description: string
    category: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    tags: string[]
    brand: string
    sku: string
    weight: number
    dimensions: {
        width: number
        height: number
        depth: number
    }
    warrantyInformation: string
    shippingInformation: string
    availabilityStatus: string
    reviews: IReview[]
    returnPolicy: string
    minimumOrderQuantity: number
    meta: {
        createdAt: string
        updatedAt: string
        barcode: string
        qrCode: string
    }
    thumbnail: string
    images: string[]
}

interface IProductStore {
    product: IProduct[]
    setProduct: (productData: IProduct[]) => void
    addProduct: (newProduct: IProduct) => void
    updateProduct: (updatedProduct: IProduct) => void
    deleteProduct: (productId: number) => void
    fetchProducts : ()=> Promise<void>;
}

const defaultProductData = {
    id: 0,
    title: '',
    description: '',
    category: '',
    price: 0,
    discountPercentage: 0,
    rating: 0,
    stock: 0,
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
    availabilityStatus: '',
    reviews: [],
    returnPolicy: '',
    minimumOrderQuantity: 0,
    meta: {
        createdAt: '',
        updatedAt: '',
        barcode: '',
        qrCode: '',
    },
    thumbnail: '',
    images: [],
}

export const productStore = create<IProductStore,[['zustand/persist', unknown]]>(
    persist(
        (set) => ({
            product: [defaultProductData],
            setProduct: (productData) => set({ product: productData }),
            fetchProducts : async()=>{
                const response = await getAllProducts();
                set ({ product : response.products})
            },
            addProduct: (newProduct) =>
                set((state) => ({
                    product: [...state.product, newProduct],
                })),
            updateProduct: (updatedProduct) =>
                set((state) => ({
                    product: state.product.map((product) =>
                        product.id === updatedProduct.id
                            ? (product = updatedProduct)
                            : product
                    ),
                })),
            deleteProduct: (productId) =>
                set((state) => ({
                    product: state.product.filter(
                        (product) => product.id !== productId
                    ),
                })),
        }),
        {
            name: 'Ecommerce_Product_Store',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)

export interface ICommentType {
    id : number;
    body : string;
    postId : number;
    userId : number;
    likes : number;
    user : {
        id : number;
        username : string;
        fullName : string;
    }
}

interface ICommentStore {
    comments : ICommentType[];
    AddComment : (newComment : ICommentType)=>void;
    SetComments : (APIComments : ICommentType[])=>void;
}

export const commentStore = create<ICommentStore>(
    (set)=>({
        comments : [],
        AddComment : (newComment) => set((state)=>({
            comments : [...state.comments, newComment]
        })),
        SetComments : (APIComments) => set(()=>({
            comments : APIComments
        }))
    })
)

export interface IUser {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: "male" | "female" | "other";
    email: string;
    phone: string;
    username: string;
    password: string;
    birthDate: string;
    image: string;
    bloodGroup: string;
    height: number;
    weight: number;
    eyeColor: string;
    hair: {
      color: string;
      type: string;
    };
    ip: string;
    address: {
      address: string;
      city: string;
      state: string;
      stateCode: string;
      postalCode: string;
      coordinates: {
        lat: number;
        lng: number;
      };
      country: string;
    };
    macAddress: string;
    university: string;
    bank: {
      cardExpire: string; 
      cardNumber: string;
      cardType: string;
      currency: string;
      iban: string;
    };
    company: {
      department: string;
      name: string;
      title: string;
      address: {
        address: string;
        city: string;
        state: string;
        stateCode: string;
        postalCode: string;
        coordinates: {
          lat: number;
          lng: number;
        };
        country: string;
      };
    };
    ein: string;
    ssn: string;
    userAgent: string;
    crypto: {
      coin: string;
      wallet: string;
      network: string;
    };
    role: "admin" | "moderator" | "user";
  }
  
export interface IUpdateUserInfo { 
    firstName : string;
    lastName : string;
    age : number;
    gender : "male" | "female" | "other";
    email : string;
    phone : string;
    image : string;
    role : "admin" | "moderator" | "user";
}


interface IUserStore {
    users : IUser[];
    fetchUsers : ()=> Promise<void>;
    updateUser : (id:number,updatedInformation : IUpdateUserInfo)=>void;
}

export const userStore = create<IUserStore,[['zustand/persist', unknown]]>(
    persist(
        (set)=>({
            users : [],
            fetchUsers : async()=>{
                const response = await getAllUsers();
                set({users : response.users})
            },
            updateUser : (id,updatedInformation)=> set((state)=>({
                users : state.users.map((user)=>user.id===id?{...user,...updatedInformation}:user)
            })),
        }),
        {
            name : "user-storage",
        }
    )
)

export interface IOrder{
    id: number;
    total: number;
    discountedTotal: number;
    userId: number;
    totalProducts: number;
    totalQuantity: number;
    status : boolean;
};

interface IOrderStore {
    orders : IOrder[];
    fetchOrders : ()=>Promise<void>;
    updateStatus : (id:number)=>void;
}

export const orderStore = create<IOrderStore, [['zustand/persist', unknown]]>(
    persist(
        (set)=>({
            orders : [],
            fetchOrders : async()=>{
                const response = await getAllCarts();

                set({orders : response.carts.map((cart:IOrder)=>({...cart, status : true}))});
            },
            updateStatus : (id:number) => set((state)=>({
                orders : state.orders.map((order)=>order.id === id ? {...order, status: !order.status} : order)
            }))
        }),
        {
            name : "order-store",
            storage : createJSONStorage(()=>sessionStorage)
        }
    )
)