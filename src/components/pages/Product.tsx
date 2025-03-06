import { Button, Card, Col, Dropdown, Input, Popconfirm, Row, Space, Spin, message, Pagination } from 'antd';
import { IProduct, productStore } from '../utils/AppStores';
import { useEffect, useReducer, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteProduct, getAllCategories } from '../utils/ProductAPI';
import { EditOutlined, DeleteOutlined, SettingOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';

interface ISearchProduct {
  type: 'search';
  keyword: string;
}
interface ISortProduct {
  type: 'sort';
  orderBy: 'price' | 'rating';
  order: 'asc' | 'desc';
}
interface IFilterProduct {
  type: 'filter';
  category: string;
}
interface ISetProducts {
  type: 'set';
  products: IProduct[];
}

type ActionType = ISearchProduct | IFilterProduct | ISortProduct | ISetProducts;

const reducer = (state: { all: IProduct[], filtered: IProduct[] }, action: ActionType) => {
  switch (action.type) {
    case "set":
      return { all: action.products, filtered: action.products };

    case "filter":
      return {
        ...state,
        filtered: action.category === "all"
          ? state.all
          : state.all.filter((product) => product.category === action.category),
      };

    case "search":
      return {
        ...state,
        filtered: state.all.filter((product) =>
          product.title.toLowerCase().includes(action.keyword.toLowerCase())
        ),
      };

    case "sort":
      return {
        ...state,
        filtered: [...state.filtered].sort((a, b) => {
          const order = action.order === "asc" ? 1 : -1;
          return action.orderBy === "rating"
            ? (a.rating - b.rating) * order
            : (a.price - b.price) * order;
        }),
      };

    default:
      return state;
  }
};

const Product = () => {
  const productData = productStore();
  const [state, dispatch] = useReducer(reducer, { all: [], filtered: [] });
  const [messageAPI, contextHolder] = message.useMessage();

  const successDelete = () => {
    messageAPI.open({
      type: "success",
      content: "Product Deleted Successfully",
    });
  };

  const { data: categoryData, isSuccess, isLoading } = useQuery<string[]>({
    queryKey: ["category"],
    queryFn: getAllCategories,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState({ orderBy: "price", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const pageSize = 8; // Define how many products per page

  useEffect(() => {
    if (productData.product.length === 1) {
      productData.fetchProducts();
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "set", products: productData.product });
  }, [productData.product]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ("key" in e && e.key !== "Enter") return;
    dispatch({ type: "search", keyword: searchKeyword });
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    dispatch({ type: "filter", category: value });
    setCurrentPage(1); 
  };

  const handleSortChange = (value: { key: string }) => {
    const [orderBy, order] = value.key.split("_");
    setSortOption({ orderBy: orderBy as "price" | "rating", order: order as "asc" | "desc" });
    dispatch({ type: "sort", orderBy: orderBy as "price" | "rating", order: order as "asc" | "desc" });
  };

  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    retry: false,
    onSuccess(data) {
      successDelete();
      console.log(data);
    },
  });

  const handleDelete = (productId: number) => {
    productData.deleteProduct(productId);
    mutate(productId);
  };

  const categoryMenuItems = [
    { key: "all", label: "All", onClick: () => handleCategoryChange("all") },
    ...categoryData?.map((category) => ({
      key: category,
      label: category,
      onClick: () => handleCategoryChange(category),
    })) || [],
  ];

  const sortMenuItems = [
    { key: "price_asc", label: "Price - Low to High", onClick: () => handleSortChange({ key: "price_asc" }) },
    { key: "price_desc", label: "Price - High to Low", onClick: () => handleSortChange({ key: "price_desc" }) },
    { key: "rating_asc", label: "Rating - Low to High", onClick: () => handleSortChange({ key: "rating_asc" }) },
    { key: "rating_desc", label: "Rating - High to Low", onClick: () => handleSortChange({ key: "rating_desc" }) },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const sortedAndFilteredProducts = state.filtered.slice();

  sortedAndFilteredProducts.sort((a, b) => {
    const order = sortOption.order === "asc" ? 1 : -1;
    return sortOption.orderBy === "rating"
      ? (a.rating - b.rating) * order
      : (a.price - b.price) * order;
  });

  const paginatedProducts = sortedAndFilteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;
  }

  if (!isSuccess) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      {contextHolder}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "16px", marginBottom: "16px" }}>
        <Button variant='filled' onClick={() => navigate('/product/add')}>Add Product</Button>
        <Dropdown menu={{ items: categoryMenuItems }} trigger={["click"]}>
          <Button>{selectedCategory === "all" ? "All Categories" : selectedCategory}</Button>
        </Dropdown>
        <Dropdown menu={{ items: sortMenuItems }} trigger={["click"]}>
          <Button>Sort by {sortOption.orderBy} ({sortOption.order})</Button>
        </Dropdown>
        <Space>
          <Input
            placeholder="Search Products"
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyDown={handleSearch}
            style={{ width: "200px" }}
          />
          <Button icon={<SearchOutlined />} onClick={handleSearch} />
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        {paginatedProducts.map((product) => (
          <Col span={6} key={product.id}>
            <Card
              style={{ width: "100%" }}
              cover={<img className="product-card-image" alt={product.title} src={product.images[0]} />}
              actions={[
                <SettingOutlined key="setting" onClick={() => navigate(`/product/${product.id}`)} />,
                <EditOutlined key="edit" onClick={() => navigate(`/editProduct/${product.id}`)} />,
                <Popconfirm title="Delete Product" description="Are you sure to delete this product?" onConfirm={() => handleDelete(product.id)} okText="Yes" cancelText="No">
                  <DeleteOutlined key="delete" />
                </Popconfirm>,
              ]}
            >
              <Card.Meta
                title={product.title}
                description={`Category: ${product.category} | Price: $${product.price} | Rating: ${product.rating}`}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={state.filtered.length}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: 20, display: "flex", justifyContent: "center" }}
      />
    </>
  );
};

export default Product;
