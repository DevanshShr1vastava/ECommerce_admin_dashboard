import { useQuery } from '@tanstack/react-query'
import { Card, Carousel, Col, Flex, List, Row, Spin } from 'antd'
import Meta from 'antd/es/card/Meta'
import { getQuotes, getRecipes } from '../utils/DashboardAPI'

import { getAllPosts } from '../utils/PostAPI'
import { IPostRecieve } from './Blogs'
import { Link } from 'react-router'

interface IRecipeData {
    recipes: {
        id: number
        name: string
        image: string
        ingredients: string[]
        instructions: string[]
        prepTimeMinutes: number
        cookTimeMinutes: number
        servings: number
        difficulty: string
        cuisine: string
        caloriesPerServing: number
        tags: string[]
        userId: number
    }[]
}

interface IQuoteData {
    quotes: {
        id: number
        quote: string
        author: string
    }[]
}

const Dashboard = () => {
    const {
        data: blogs,
        isLoading: BlogLoading,
    } = useQuery<IPostRecieve>({
        queryKey: ['blogs'],
        queryFn: getAllPosts,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
    const top5LikedBlogs = blogs?.posts
        .sort((a, b) => b.reactions.likes - a.reactions.likes)
        .slice(0, 5)
  
    

    const { data, isLoading } = useQuery<IRecipeData>({
        queryKey: ['recipe'],
        queryFn: getRecipes,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const { data: quoteData, isLoading: quoteLoading } = useQuery<IQuoteData>({
        queryKey: ['quote'],
        queryFn: getQuotes,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    if (isLoading || quoteLoading || BlogLoading)
        return (
            <Spin
                size="large"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
                }}
            />
        )

    return (
        <>
            <Row gutter={16}>
  <Col span={12}>
    <Carousel
      autoplay={{ dotDuration: true }}
      autoplaySpeed={5000}
      arrows
      style={{ height: '100%' }}
    >
      {data?.recipes.map((recipe) => (
        <Card
          loading={isLoading}
          key={recipe.id}
          cover={
            <img
              alt="recipe image"
              src={recipe.image}
              style={{
                width: '100%',
                height: '300px',
                objectFit: 'cover',
              }}
            />
          }
        >
          <Meta
            title={recipe.name}
            description={
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={12}>
                  <div>
                    <strong>Cuisine:</strong> {recipe.cuisine}
                  </div>
                  <div>
                    <strong>Difficulty:</strong> {recipe.difficulty}
                  </div>
                  <div>
                    <strong>Prep Time:</strong> {recipe.prepTimeMinutes} min
                  </div>
                  <div>
                    <strong>Cook Time:</strong> {recipe.cookTimeMinutes} min
                  </div>
                </Col>
                <Col xs={24} sm={12} md={12}>
                  <div>
                    <strong>Servings:</strong> {recipe.servings}
                  </div>
                  <div>
                    <strong>Calories:</strong> {recipe.caloriesPerServing}{' '}
                    cal/serving
                  </div>
                </Col>
              </Row>
            }
          />
        </Card>
      ))}
    </Carousel>
  </Col>
  <Col span={12} style={{ display: 'flex', flexDirection: 'column' }}>
    <List
      size="small"
      header={<div>Top 5 Most Viewed Posts</div>}
      bordered
      dataSource={top5LikedBlogs}
      renderItem={(post, index) => (
        <List.Item key={post.id}>
          <List.Item.Meta
            title={<Link to={`/blogs/${post.id}`}>{post.title}</Link>}
            description={`Views: ${post.views} | Likes: ${post.reactions.likes}`}
          />
        </List.Item>
      )}
      style={{ flexGrow: 1 }} 
    />
  </Col>
</Row>

<Row justify="space-evenly">
  <Col span={24}>
    <Carousel
      autoplay={{ dotDuration: true }}
      autoplaySpeed={5000}
      arrows
      dotPosition="bottom"
      dots={true}
      style={{ position: 'relative', width: '100%' }} 
    >
      {quoteData?.quotes.map((quote) => (
        <Card loading={quoteLoading} key={quote.id}>
          <Flex align='center' justify='center'>
          <Meta title={quote.quote} description={quote.author} />
          </Flex>
        </Card>
      ))}
    </Carousel>
  </Col>
</Row>

        </>
    )
}

export default Dashboard
