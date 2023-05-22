import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SWRConfig } from 'swr';
import { Login } from '../../../components/Login';
import { setImage } from '../../../lib/wp';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';
import { Modal } from './Modal';
import { ModelSwitch } from './ModelSwitch';
import { SettingsModal } from './SetingsModal';

type LoaderProps = {
    attributes: ImageLike;
    setAttributes: (attributes: ImageLike) => void;
};

export const Loader = ({ setAttributes }: LoaderProps) => {
    const { setImportingMessage, imageBlockId, setImageBlockId } =
        useGlobalState();
    const [loginError, setLoginError] = useState<string>();

    const onClose = () => {
        setImportingMessage('');
        setImageBlockId(undefined);
    };

    const handleImageImport = (image: ImageLike) => {
        setImportingMessage(__('Importing...', 'stable-diffusion'));
        setImage(image).then(async (newImage) => {
            if (!newImage) return;
            setAttributes({
                id: newImage.id,
                caption: newImage.caption.raw,
                url: newImage.source_url,
                alt: newImage.alt_text ?? newImage.caption.raw,
            });
            await new Promise((r) => setTimeout(r, 1000));
            setImportingMessage(__('Done!', 'stable-diffusion'));

            // Artificial delay to avoid closing too quickly
            setTimeout(() => {
                requestAnimationFrame(onClose);
            }, 1000);
        });
    };

    if (!imageBlockId) return null;

    return (
        <SWRConfig
            value={{
                onError: (err) => {
                    // if the error includes "authentication" in the err.detail, show <Login
                    if (err.detail.includes('authentication')) {
                        setLoginError(
                            __('Please log in to continue', 'stable-diffusion'),
                        );
                    }
                },
            }}>
            <Modal onClose={onClose} setImage={handleImageImport} />
            <SettingsModal />
            <ModelSwitch />
            {loginError ? (
                <Login
                    incomingError={loginError}
                    onClose={() => setLoginError(undefined)}
                />
            ) : null}
        </SWRConfig>
    );
};
