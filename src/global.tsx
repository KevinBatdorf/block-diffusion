import domReady from '@wordpress/dom-ready';
import { render, createRoot } from '@wordpress/element';
import { LoginPrompt } from './components/LoginPrompt';
import './editor.css';

domReady(() => {
    const span = document.createElement('span');
    document.body.appendChild(span);

    if (createRoot) createRoot(span).render(<LoginPrompt />);
    else render(<LoginPrompt />, span);
});
