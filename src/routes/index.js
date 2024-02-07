import React from 'react';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { Container } from '~/styles/theme';
import { Create } from '~/pages/Create';
import { Edit } from '~/pages/Edit';
import { Dashboard } from '~/pages/Dashboard';
import { Details } from '~/pages/Details';
import { Profile } from '~/pages/Profile';
import { SignIn } from '~/pages/Sign/In';
import { SignUp } from '~/pages/Sign/Up';
import { Header } from '~/components/Header';
import { Guest } from './Guest';
import { Privated } from './Privated';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <Guest>
            <SignIn />
          </Guest>
        ),
      },
      {
        path: '/signup',
        element: (
          <Guest>
            <SignUp />
          </Guest>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <Privated>
            <Dashboard />
          </Privated>
        ),
      },
      {
        path: '/profile',
        element: (
          <Privated>
            <Profile />
          </Privated>
        ),
      },
      {
        path: '/create',
        element: (
          <Privated>
            <Create />
          </Privated>
        ),
      },
      {
        path: '/meetups/:id/edit',
        element: (
          <Privated>
            <Edit />
          </Privated>
        ),
      },
      {
        path: '/meetups/:id',
        element: (
          <Privated>
            <Details />
          </Privated>
        ),
      },
    ],
  },
]);

export function Navigation() {
  return (
    <Container>
      <RouterProvider router={router} />
    </Container>
  );
}
