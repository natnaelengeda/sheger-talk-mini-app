import type { ComponentType, JSX } from 'react';

import { Home } from '@/pages/home';
import { InitDataPage } from '@/pages/init-data-page';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: Home },
  { path: '/init-data', Component: InitDataPage, title: 'Init Data' },
];
