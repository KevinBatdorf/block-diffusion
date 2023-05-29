import { Snackbar } from '@wordpress/components';
import { useState, useEffect, createRoot, render } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { MouseEvent } from 'react';
import { Login } from './Login';

export const LoginPrompt = () => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShow(true);
    };
    useEffect(() => {
        const rows = document
            ?.getElementById('deactivate-stable-diffusion')
            ?.closest('.row-actions');
        rows?.lastElementChild?.querySelector('a')?.after(' | ');
        const span = document.createElement('span');
        rows?.lastElementChild?.after(span);
        const LoginLink = () => (
            <a
                data-cy="api-token-action"
                href="#key"
                role="button"
                onClick={handle}>
                {__('API Token', 'stable-diffusion')}
            </a>
        );
        if (createRoot) createRoot(span).render(<LoginLink />);
        else render(<LoginLink />, span);
        return () => span.remove();
    }, []);

    useEffect(() => {
        // ALlow to open from custom event
        const handle = (e: Event) => {
            e.preventDefault();
            setShow(true);
        };
        document.addEventListener('stable-diffusion::openLogin', handle);
        return () =>
            document.removeEventListener('stable-diffusion::openLogin', handle);
    }, []);

    const SuccessToast = () => (
        <div className="stable-diffusion-editor">
            <div className="w-full fixed bottom-4 left-0 right-0 px-4 flex justify-end z-max pointer-events-none">
                <div className="shadow-2xl" data-cy="login-success-toast">
                    <Snackbar>
                        {__(
                            'The token was successfully saved.',
                            'stable-diffusion',
                        )}
                    </Snackbar>
                </div>
            </div>
        </div>
    );
    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => setSuccess(false), 5000);
        return () => clearTimeout(timer);
    }, [success]);

    return (
        <>
            {show && (
                <Login
                    onClose={(status) => {
                        setShow(false);
                        setSuccess(status === 'success');
                    }}
                />
            )}
            {success && <SuccessToast />}
        </>
    );
};
