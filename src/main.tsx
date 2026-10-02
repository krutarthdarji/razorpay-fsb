import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { BladeProvider } from '@razorpay/blade/components';
import { bladeTheme } from '@razorpay/blade/tokens';
import { I18nProvider } from '@razorpay/i18nify-react';
import '@razorpay/blade/fonts.css';
import { App } from './App';
import { GlobalStyle } from './GlobalStyle';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* en-IN gives Indian digit grouping in Amount: ₹5,00,000 */}
    <I18nProvider initData={{ locale: 'en-IN' }}>
      <BladeProvider themeTokens={bladeTheme} colorScheme="light">
        <GlobalStyle />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </BrowserRouter>
      </BladeProvider>
    </I18nProvider>
  </React.StrictMode>,
);
