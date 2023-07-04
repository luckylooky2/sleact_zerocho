import 'core-js/stable';
import 'regenerator-runtime/runtime';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
// SWRDevtools : 모든 swr 요청에 대해 관련 정보를 보여줌
import SWRDevtools from '@jjordy/swr-devtools';

import App from '@layouts/App';

// client.tsx는 cra에서 index.tsx 역할

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.NODE_ENV === 'production' ? 'https://sleact.nodebird.com' : 'http://localhost:3090';

render(
  <BrowserRouter>
    <SWRDevtools>
      <App />
    </SWRDevtools>
  </BrowserRouter>,
  document.querySelector('#app'),
);
