import domReady from '@wordpress/dom-ready';
import { render, createRoot } from '@wordpress/element';
import { SuggestionManager } from './block/components/modals/SuggestionManager';
import { LoginPrompt } from './components/LoginPrompt';
import './editor.css';

domReady(() => {
    const span = document.createElement('span');
    document.body.appendChild(span);

    const ToRender = () => (
        <>
            <LoginPrompt />;
            <SuggestionManager />
        </>
    );

    if (createRoot) createRoot(span).render(<ToRender />);
    else render(<ToRender />, span);
});
