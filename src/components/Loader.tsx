import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { setImage } from '../lib/wp';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';
import { Modal } from './Modal';
import { ModalSelect } from './ModelSelect';

type LoaderProps = {
    setAttributes: (attributes: ImageLike) => void;
    clientId?: string;
};

export const Loader = ({ setAttributes, clientId }: LoaderProps) => {
    const { setImportingMessage, setCurrentInterface, setShowSelectScreen } =
        useGlobalState();
    const [open, setOpen] = useState(false);

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
                requestAnimationFrame(() => {
                    setCurrentInterface(undefined);
                });
            }, 1500);
        });
    };

    useEffect(() => {
        const namespace = 'kevinbatdorf/stable-diffusion-open';
        const open = (event: CustomEvent<{ clientId: string }>) => {
            if (event?.detail?.clientId !== clientId) return;
            setOpen(true);
            setShowSelectScreen(true);
        };
        window.addEventListener(namespace, open as (e: Event) => void);
        return () => {
            window.removeEventListener(namespace, open as (e: Event) => void);
        };
    }, [clientId, setShowSelectScreen]);

    if (!open) return null;

    return (
        <>
            <ModalSelect />
            <Modal setImage={handleImageImport} />
        </>
    );
};
