import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Root from './routes/root';
import { NewGame } from './routes/NewGame';
import { Game } from './routes/Game';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "new",
        element: <NewGame/>
      },
      {
        path: "game/:gameId",
        element: <Game/>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
        <RouterProvider router={router} />
  </React.StrictMode>,
)
