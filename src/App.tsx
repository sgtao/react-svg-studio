import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AssetDetailPage from './routes/AssetDetailPage'
import CategoryPage from './routes/CategoryPage'
import CollectionPage from './routes/CollectionPage'
import HomePage from './routes/HomePage'
import NotFoundPage from './routes/NotFoundPage'
import RootLayout from './routes/RootLayout'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
  },
  {
    path: '/:lang',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category', element: <CollectionPage /> },
      { path: 'category/:category', element: <CategoryPage /> },
      { path: 'category/:category/:assetId', element: <AssetDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
], { basename: import.meta.env.BASE_URL })

export default function App() {
  return <RouterProvider router={router} />
}
