import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "../utils/PostAPI";
import { List, Spin } from "antd";
import { LikeOutlined,  StarOutlined, DislikeOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Space } from 'antd';
import { Link } from "react-router-dom";


export interface IPost{
  id : number;
  title : string;
  body : string;
  tags : string[],
  reactions : {
    likes : number;
    dislikes : number;
  };
  views : number;
  userId : number;
}

export interface IPostRecieve{
  posts : IPost[];
  total : number;
  skip : number;
  limit : number;
}

const Blogs = () => {

  const {data : blogs, isLoading, isError, error} = useQuery<IPostRecieve>({
    queryKey : ['blogs'],
    queryFn : getAllPosts,
    retry : false,
    refetchOnMount : false,
    refetchOnWindowFocus : false,
  })

  const [blogData, setBlogData] = useState<IPost[]>([]);

  useEffect(()=>{
    if(!isLoading && blogs?.posts) setBlogData(blogs.posts)
  },[isLoading, blogs])


  const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );


  if (isLoading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }} />;
  if (isError) return <h1>{error.message}</h1>;

  return (
    <>
      <List
        itemLayout="vertical"
        size="default"
        pagination={{
          onChange: (page)=>{
            console.log(page);
          },
          pageSize : 4
        }}
        dataSource={blogData}
        renderItem={(item)=>(
          <List.Item
            key = {item.title}
            actions ={[
              <IconText icon={StarOutlined} text={String(item.views)} key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text = {String(item.reactions.likes)} key="list-vertical-like-o" />,
              <IconText icon={DislikeOutlined} text = {String(item.reactions.dislikes)} key= "list-vertical-dislike-o" />
            ]}
          >
          <List.Item.Meta
          avatar={<Avatar size="default" icon={<UserOutlined />} />}
          title={<Link to={`/blogs/${item.id}`}>{item.title}</Link>}
          description={[item.tags.join(' | ')]}
        />
        {item.body}
      </List.Item>
    )}
  />
    </>
  );
};

export default Blogs;
