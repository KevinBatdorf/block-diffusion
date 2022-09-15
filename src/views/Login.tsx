import { useRef, useState } from '@wordpress/element';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import image from '../assets/login.png';
import { useAuth } from '../hooks/useAuth';
import { DialogWithImageModal } from '../layouts/DialogWithImage';
import { useAuthStore } from '../state/auth';

type LoginProps = {
    onClose: () => void;
};

export const Login = ({ onClose }: LoginProps) => {
    const { success, loading, error, login } = useAuth();
    const { storeApiToken } = useAuthStore();
    const [token, setToken] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const initialFocus = useRef<HTMLInputElement>(null);

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
            console.error(error);
            // Replicate error
            if (error?.detail) return error.detail;
            if (error?.message) {
                // WP rest api error
                return error?.code
                    ? `${error.code}: ${error.message}`
                    : error.message;
            }
            // Maybe server error or similar
            if (error?.statusText) return error.statusText;
            return __('Unknown error', 'stable-diffusion');
        });
    }

    return (
        <DialogWithImageModal
            open={true}
            onClose={onClose}
            title={__('Login', 'stable-diffusion')}
            image={{
                href: 'https://replicate.com/stability-ai/stable-diffusion?prediction=qffyxjvmbvfdbao7vvv2oss2gq',
                title: 'multicolor hyperspace',
                url: image,
            }}
            initialFocus={initialFocus}>
            <div className="flex flex-col justify-between flex-grow bg-white h-auto lg:h-72">
                <div className="flex flex-col flex-grow p-4">
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
                                    className="w-full h-10 rounded-none border border-gray-900 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 focus:shadow-none"
                                />
                                {errorMsg && (
                                    <p className="text-red-500 m-0">
                                        {errorMsg}
                                    </p>
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
                    <p className="m-0 mb-6">
                        {__(
                            'This plugin connects to the Replicate API and requires an active API token.',
                            'stable-diffusion',
                        )}
                    </p>
                    <div>
                        <a
                            href="https://replicate.com"
                            target="_blank"
                            className="text-wp-theme-500 underline text-base"
                            rel="noreferrer">
                            replicate.com
                        </a>
                    </div>
                </div>
                <div className="mt-8 flex gap-x-2 justify-center md:justify-start">
                    <a
                        href="https://replicate.com/terms"
                        target="_blank"
                        className="text-wp-theme-500 underline text-base"
                        rel="noreferrer">
                        {__('Replicate terms')}
                    </a>
                    <a
                        href="https://replicate.com/privacy"
                        className="text-wp-theme-500 underline text-base"
                        target="_blank"
                        rel="noreferrer">
                        {__('Replicate privacy policy')}
                    </a>
                </div>
            </div>
        </DialogWithImageModal>
    );
};
