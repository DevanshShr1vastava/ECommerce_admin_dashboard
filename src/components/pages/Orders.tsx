import { useEffect, useState } from "react";
import { TableProps, TableColumnsType, Spin, Table, Space, Switch } from "antd";
import { IOrder, orderStore } from "../utils/AppStores";

interface IProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface ICart extends IOrder{
  key : string;
}

type DataIndex = keyof ICart;

type OnChange = NonNullable<TableProps<ICart>['onChange']>;
type Filters = Parameters<OnChange>[1];
type GetSingle<T> = T extends (infer U)[] ? U : never;
type Sorts = GetSingle<Parameters<OnChange>[2]>;

const Orders = () => {
  const OrderStore = orderStore();
  const CartData = OrderStore.orders;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const [sortedInfo, setSortedInfo] = useState<Sorts>({});

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter as Sorts);
  };


  const columns: TableColumnsType<ICart> = [
    { title: 'Cart ID', width:"10%", dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
    { title: 'User ID' , width:"10%", dataIndex: 'userId', key: 'userId', sorter: (a, b) => a.userId - b.userId },

    { title: 'Total Products' , width:"15%", dataIndex: 'totalProducts', key: 'totalProducts', sorter: (a, b) => a.totalProducts - b.totalProducts },
    { title: 'Total Quantity', width:"15%", dataIndex: 'totalQuantity', key: 'totalQuantity', sorter: (a, b) => a.totalQuantity - b.totalQuantity },
    { title: 'Total Price', dataIndex: 'total', key: 'total', sorter: (a, b) => a.total - b.total },
    { title: 'Discounted Total', dataIndex: 'discountedTotal', key: 'discountedTotal', sorter: (a, b) => a.discountedTotal - b.discountedTotal },
    {
      title : 'Status',
      key : 'action',
      render : (text, record) =>(
        <>
          <Space>
              <Switch checkedChildren="Completed" unCheckedChildren="Pending" defaultChecked={record.status} onChange={()=>{OrderStore.updateStatus(record.id)}}/>
          </Space>
        </>
      )
    }
  ];

  const data = CartData?.map((cart) => ({
    key: String(cart.id),
    id: cart.id,
    userId: cart.userId,

    totalProducts: cart.totalProducts,
    totalQuantity: cart.totalQuantity,
    total: cart.total,
    discountedTotal: cart.discountedTotal,
    status : cart.status
  })) || [];

  useEffect(()=>{
    if(OrderStore.orders.length === 0){
      OrderStore.fetchOrders().then(()=>setIsLoading(false));
    }
    else{
      setIsLoading(false);
    }
  },[])

  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;

  return <Table<ICart> columns={columns} dataSource={data} onChange={handleChange} />;
};

export default Orders;
