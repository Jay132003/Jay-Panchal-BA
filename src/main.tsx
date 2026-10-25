import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import './styles/home.css';
import './styles/playlists.css';
import './styles/bento.css';
import './styles/life.css';
import './styles/intro.css';

// A refresh always opens the landing page at the top, where its intro plays —
// not wherever the browser remembers you were (that landed mid-hero). Section
// links like #skills still jump to their section.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const hash = window.location.hash;
if (!hash || ['#home', '#about', '#work-page', '#case-studies', '#gallery-page', '#friends-page'].includes(hash)) window.scrollTo(0, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
