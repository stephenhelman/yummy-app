import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { FormProvider } from './form/FormContext';
import { LanguageProvider } from './i18n/LanguageContext';
import './styles/tokens.css';
import './styles/base.css';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root element');

createRoot(root).render(
  <StrictMode>
    <LanguageProvider>
      <FormProvider>
        <App />
      </FormProvider>
    </LanguageProvider>
  </StrictMode>,
);
