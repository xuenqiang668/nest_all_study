import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import { BookManage } from './pages/BookManage/index'
import { Login } from './pages/Login/index'
import { Register } from './pages/Register/index'

const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/",
    element: <BookManage />
  }
]

const router = createBrowserRouter(routes)

const root = createRoot(document.getElementById('root')!)


root.render(
  <RouterProvider router={router} />
)
