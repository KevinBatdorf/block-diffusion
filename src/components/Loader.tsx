import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
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
    const [showSelectScreen, setShowSelectScreen] = useState(true);
    const {
        setImportingMessage,
        setLoading,
        currentInterface,
        setCurrentInterface,
    } = useGlobalState();
    const timerRef = useRef(0);
    const rafRef = useRef(0);

    const handleImageImport = (image: ImageLike) => {
        setImage(image).then((newImage) => {
            if (!newImage) return;
            setAttributes({
                id: newImage.id,
                caption: newImage.caption.raw,
                url: newImage.source_url,
                alt: newImage.alt_text,
            });
            setImportingMessage(__('Done!', 'stable-diffusion'));

            // Artificial delay to avoid closing too quickly
            timerRef.current = window.setTimeout(() => {
                rafRef.current = window.requestAnimationFrame(() => {
                    setCurrentInterface(undefined);
                });
            }, 1000);
        });
    };

    useEffect(() => {
        const namespace = 'kevinbatdorf/stable-diffusion-open';
        const open = (event: CustomEvent<{ clientId: string }>) => {
            if (event?.detail?.clientId !== clientId) return;
            setShowSelectScreen(true);
        };
        window.addEventListener(namespace, open as (e: Event) => void);
        return () => {
            window.removeEventListener(namespace, open as (e: Event) => void);
        };
    }, [clientId]);

    useLayoutEffect(() => {
        if (currentInterface) {
            setLoading(false);
            setImportingMessage('');
            // Keep the select modal closed if model interface is open
            setShowSelectScreen(false);
        }
        window.clearTimeout(timerRef.current);
        window.clearTimeout(rafRef.current);
    }, [currentInterface, setImportingMessage, setLoading]);

    return (
        <>
            <ModalSelect
                open={showSelectScreen}
                setModel={setCurrentInterface}
                onClose={() => setShowSelectScreen(false)}
            />
            <Modal
                setImage={handleImageImport}
                modelName={currentInterface}
                onClose={() => setCurrentInterface(undefined)}
            />
        </>
    );
};
