import { store as blockEditorStore } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { setImage } from '../lib/wp';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';
import { Modal } from './Modal';
import { ModalSelect } from './ModelSelect';

type LoaderProps = {
    attributes: ImageLike;
    setAttributes: (attributes: ImageLike) => void;
    clientId?: string;
};

export const Loader = ({
    setAttributes,
    clientId,
    attributes,
}: LoaderProps) => {
    const {
        setImportingMessage,
        setCurrentInterface,
        setShowSelectScreen,
        setImageBlockId,
        imageBlockId,
    } = useGlobalState();
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - types seem outdated
    const { removeBlock } = useDispatch(blockEditorStore);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line - types seem outdated
    const { getBlock } = useSelect((s) => s(blockEditorStore), []);

    const onClose = () => {
        const b = getBlock(imageBlockId);
        if (!b?.attributes?.caption) {
            removeBlock(imageBlockId);
        }
        setShowSelectScreen(false);
        setCurrentInterface(undefined);
        setOpen(false);
        setImportingMessage('');
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
                requestAnimationFrame(() => onClose());
            }, 1500);
        });
    };

    useEffect(() => {
        const namespace = 'kevinbatdorf/stable-diffusion-open';
        const open = (event: CustomEvent<{ clientId: string }>) => {
            if (event?.detail?.clientId !== clientId) return;
            setOpen(true);
            setShowSelectScreen(true);
            setImageBlockId(clientId);
        };
        window.addEventListener(namespace, open as (e: Event) => void);
        return () => {
            window.removeEventListener(namespace, open as (e: Event) => void);
        };
    }, [clientId, setShowSelectScreen, setImageBlockId]);

    if (!open) return null;

    return (
        <>
            <ModalSelect onClose={onClose} />
            <Modal onClose={onClose} setImage={handleImageImport} />
        </>
    );
};
