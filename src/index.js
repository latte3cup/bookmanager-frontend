import { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import router from './routes'
import { RouterProvider } from 'react-router-dom'
import Loading from './pages/Loading'
import { Provider } from 'react-redux'
import store from './store'

const root = ReactDOM.createRoot(document.getElementById('root'))

// 라우터 내부 컴포넌트를 개별로 감싸는 중복이 사라지고, 전역 Suspense 지연로딩 처리가능
// github 배포시 basename 설정 필수 - basename='process.env.PUBLIC_URL'
root.render(
  <Provider store={store}>
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} basename={process.env.PUBLIC_URL} />
    </Suspense>
    ,
  </Provider>,
)
