import domReady from '@wordpress/dom-ready';
import { render, createRoot } from '@wordpress/element';
import { ApiKeyButton } from './components/ApiKeyButton';
import './editor.css';

domReady(() => {
    const rows = document
        ?.getElementById('deactivate-stable-diffusion')
        ?.closest('.row-actions');
    rows?.lastElementChild?.querySelector('a')?.after(' | ');

    const span = document.createElement('span');
    rows?.lastElementChild?.after(span);

    if (createRoot) createRoot(span).render(<ApiKeyButton />);
    else render(<ApiKeyButton />, span);
});
