import { useState } from '@wordpress/element';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import image from '../assets/login.png';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../state/auth';

type LoginProps = {
    initialFocus: React.RefObject<HTMLInputElement>;
};
export const Login = ({ initialFocus }: LoginProps) => {
    const { success, loading, error, login } = useAuth();
    const { storeApiToken } = useAuthStore();
    const [token, setToken] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setErrorMsg('');
    }, [token]);

    useEffect(() => {
        if (success && token) {
            storeApiToken(token);
        }
    }, [success, storeApiToken, token]);

    if (error) {
        setErrorMsg(() => {
            if (error.status === 401)
                return __('Invalid token', 'stable-diffusion');
            if (error.message) return error.message;
            if (error.statusText) return error.statusText;
            return '';
        });
    }

    return (
        <div className="p-8 flex flex-col flex-grow">
            <form
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
                    <div>
                        <input
                            ref={initialFocus}
                            id="replicate-api-key"
                            type="text"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="lg:w-96 h-10 rounded-none border border-gray-900 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 focus:shadow-none"
                        />
                        {errorMsg && (
                            <p className="text-red-500 m-0">{errorMsg}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        className="h-10 px-4 bg-gray-900 text-white rounded-none border border-gray-900 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 cursor-pointer focus:shadow-none"
                        disabled={loading}
                        onClick={() => {
                            token && login(token);
                        }}>
                        {loading
                            ? __('...', 'stable-diffusion')
                            : __('Login', 'stable-diffusion')}
                    </button>
                </div>
            </form>
            <p>
                {__(
                    'This plugin connects to the Replicate API and requires an active API token.',
                    'stable-diffusion',
                )}
            </p>
            <div>
                <a
                    href="https://replicate.com"
                    target="_blank"
                    rel="noreferrer">
                    replicate.com
                </a>
            </div>
        </div>
    );
};

export const LoginWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex max-w-screen-md2">
        <a
            href="https://replicate.com/stability-ai/stable-diffusion?prediction=qffyxjvmbvfdbao7vvv2oss2gq"
            target="_blank"
            rel="noreferrer"
            title="multicolor hyperspace"
            className="w-96 h-96 bg-cover flex-shrink-0"
            style={{ backgroundImage: `url(${image})` }}>
            <span className="sr-only">multicolor hyperspace</span>
        </a>
        <div className="flex flex-col overflow-hidden">
            {children}
            <div className="px-8 mb-2 flex gap-x-2">
                <a
                    href="https://replicate.com/terms"
                    target="_blank"
                    rel="noreferrer">
                    {__('Replicate terms')}
                </a>
                <a
                    href="https://replicate.com/privacy"
                    target="_blank"
                    rel="noreferrer">
                    {__('Replicate privacy policy')}
                </a>
            </div>
        </div>
    </div>
);
