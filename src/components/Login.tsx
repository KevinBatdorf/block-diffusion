import apiFetch from '@wordpress/api-fetch';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { mutate } from 'swr';
import { SimpleDialog } from '../filters/modal/layouts/SimpleDialog';

type LoginProps = {
    onClose?: (status?: string) => void;
    incomingError?: string;
};

export const Login = ({ onClose, incomingError }: LoginProps) => {
    const [token, setToken] = useState('');
    const [open, setOpen] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string>();
    const [loggingIn, setLoggingIn] = useState(false);
    const initialFocus = useRef<HTMLInputElement>(null);

    const login = async (token: string) => {
        setErrorMsg(undefined);
        setLoggingIn(true);
        if (!token) {
            setErrorMsg(__('Please enter a token', 'stable-diffusion'));
            setLoggingIn(false);
            return;
        }
        try {
            await apiFetch({
                path: '/kevinbatdorf/stable-diffusion/save-token',
                method: 'POST',
                data: { token },
            });
            // eslint-disable-next-line
        } catch (e: any) {
            setErrorMsg(
                e?.message ??
                    e?.detail ??
                    __('Something went wrong', 'stable-diffusion'),
            );
            return;
        }
        mutate(() => true, undefined, { revalidate: true });
        setLoggingIn(false);
        setOpen(false);
        onClose && onClose('success');
    };

    return (
        <SimpleDialog
            open={open}
            testingId="login-screen"
            onClose={() => {
                setOpen(false);
                onClose && onClose();
            }}
            title={__('Block Diffusion', 'stable-diffusion')}
            initialFocus={initialFocus}>
            <div className="flex flex-col justify-between flex-grow h-auto">
                {incomingError && (
                    <div className="p-2 bg-wp-alert-yellow mb-4">
                        {incomingError}
                    </div>
                )}
                <div className="flex flex-col flex-grow">
                    <form
                        className="mb-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            token && login(token);
                        }}>
                        <label
                            htmlFor="replicate-api-key"
                            className="text-lg font-medium block mb-2">
                            {__('API token', 'stable-diffusion')}
                        </label>
                        <div className="flex gap-x-2">
                            <div className="w-full">
                                <input
                                    ref={initialFocus}
                                    id="replicate-api-key"
                                    type="text"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="w-full h-10 rounded-none border border-gray-900 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500"
                                />
                                {errorMsg && (
                                    <p
                                        data-cy="login-error"
                                        className="text-red-500 m-0">
                                        {errorMsg}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                data-cy="login-button"
                                className="h-10 px-4 bg-gray-900 text-white rounded-none border border-gray-900 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 cursor-pointer focus:shadow-none"
                                disabled={loggingIn}
                                onClick={() => login(token)}>
                                {loggingIn
                                    ? __('...', 'stable-diffusion')
                                    : __('Login', 'stable-diffusion')}
                            </button>
                        </div>
                    </form>
                    <p className="m-0 mb-6">
                        {__(
                            'Block Diffusion connects to the Replicate API and requires an active API token.',
                            'stable-diffusion',
                        )}
                    </p>
                    <div>
                        <a
                            href="https://replicate.com"
                            target="_blank"
                            className="text-wp-theme-500 underline text-sm"
                            rel="noreferrer">
                            replicate.com
                        </a>
                    </div>
                </div>
            </div>
        </SimpleDialog>
    );
};
