import { Hero } from './pages/Hero';
import { Test } from './pages/Test';
import App from './entry/App';

export const routes = [
  {
    path: '/',
    Component: App,
    children: [
      {
        Component: Hero,
        index: true,
      },
    ],
  },
  {
    path: '/about',
    Component: App,
    children: [
      {
        Component: Test,
        index: true,
      },
    ],
  },
  {
    path: '/blog/:id',
    Component: App,
    children: [
      {
        Component: Test,
        index: true,
      },
    ],
  },
];
