import { Snackbar } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { MouseEvent } from 'react';
import { Login } from './Login';

export const ApiKeyButton = () => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const handle = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShow(true);
    };
    const SuccessToast = () => (
        <div className="stable-diffusion-editor">
            <div className="w-full fixed bottom-4 left-0 right-0 px-4 flex justify-end z-max pointer-events-none">
                <div className="shadow-2xl">
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
            <a href="#key" role="button" onClick={handle}>
                {__('API Token', 'stable-diffusion')}
            </a>
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
