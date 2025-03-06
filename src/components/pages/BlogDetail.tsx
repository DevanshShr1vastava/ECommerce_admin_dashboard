import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { addComment, getSinglePost } from "../utils/PostAPI";
import { IPost } from "./Blogs";
import { Avatar, Button, Input, List, message, Space, Spin } from "antd";
import { LikeOutlined,  StarOutlined, DislikeOutlined, UserOutlined } from '@ant-design/icons';
import { commentStore, ICommentType } from "../utils/AppStores";

const { TextArea } = Input;

const BlogDetail = () => {
  const [messageAPI, contextHolder] = message.useMessage();
  const success = ()=>[
    messageAPI.open({
      type : "success",
      content : "Comment added successfully"
    })
  ]
  const {id} = useParams();
  const [newComment, setNewComment] = useState("");
  const {data: blogDetails, isLoading, isError, error} = useQuery<IPost>({
    queryKey : ['blog',id],
    queryFn : ()=>getSinglePost(Number(id)),
    retry : false,
    refetchOnMount : false,
    refetchOnWindowFocus : false,
  })

  const CommentStore = commentStore();
  const postComments = CommentStore.comments.filter((comment)=>comment.postId===Number(id));

  const {mutate} = useMutation({
    mutationFn : (comment:ICommentType)=> addComment(comment),
    retry : false,
    onSuccess :()=>{
      setNewComment("");
    }
  })

  const handleAddComment = ()=>{
      const commentToAdd:ICommentType = {
        id : CommentStore.comments.length + 2,
        body : newComment,
        postId : Number(id),
        likes : 0,
        userId : 1,
        user : {
          id : 1,
          username : "Johnny",
          fullName : "John Schwartz"
        }
      }
      mutate(commentToAdd);
      success();
      CommentStore.AddComment(commentToAdd);
  }

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
    {contextHolder}
      <List
      itemLayout="vertical"
      size ="large"
      >

        <List.Item
          key = {blogDetails?.title}
          actions ={[
            <IconText icon={StarOutlined} text={String(blogDetails?.views)} key="list-vertical-star-o" />,
            <IconText icon={LikeOutlined} text = {String(blogDetails?.reactions.likes)} key="list-vertical-like-o" />,
            <IconText icon={DislikeOutlined} text = {String(blogDetails?.reactions.dislikes)} key= "list-vertical-dislike-o" />
          ]}
        >
        <List.Item.Meta
        avatar={<Avatar size="default" icon={<UserOutlined />} />}
        title={<Link to={`/blogs/${blogDetails?.id}`}>{blogDetails?.title}</Link>}
        description={[blogDetails?.tags.join(' | ')]}
      />
      {blogDetails?.body}
    </List.Item>
      </List>
      <br />
     <TextArea
        rows={3}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write your comment..."
      />
      <Button type="primary" onClick={handleAddComment} style={{ marginTop: 10 }}>
        Add Comment
      </Button>

      <List
  itemLayout="horizontal"
  dataSource={postComments || []} 
  renderItem={(item, index) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
        title={item.user?.username} 
        description={item.body}
      />
    </List.Item>
  )}
/>
    </>
  );
};

export default BlogDetail;
