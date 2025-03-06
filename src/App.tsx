import PageLayout from './components/layout/PageLayout'
import AppRoutes from './components/routes/AppRoutes'
import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import { commentStore, ICommentType, themeStore } from './components/utils/AppStores'
import { getAllComments } from './components/utils/PostAPI'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

const { defaultAlgorithm, darkAlgorithm } = theme

interface ICommentQuery{
    comments : ICommentType[];
    total : number;
    skip : number;
    limit : number;
}

function App() {
    const ThemeStore = themeStore()
    const {data : blogComments, isFetched  } = useQuery<ICommentQuery>({
        queryKey : ['comment'],
        queryFn : getAllComments,
        retry : false,
        refetchOnMount : false,
        refetchOnWindowFocus : false,
      })
        const CommentStore = commentStore();
        useEffect(()=>{
            if(isFetched && blogComments){
                CommentStore.SetComments(blogComments.comments);
            }
        },[isFetched, blogComments]);
        
    return (
        <ConfigProvider
            theme={{
                algorithm: ThemeStore.dark ? darkAlgorithm : defaultAlgorithm,
            }}
        >
            <Router>
                <PageLayout>
                    <AppRoutes />
                </PageLayout>
            </Router>
        </ConfigProvider>
    )
}

export default App
