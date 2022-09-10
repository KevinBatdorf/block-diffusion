import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { importImage } from '../lib/wp';
import { useGlobalState } from '../state/global';
import { ImageLike, WpImage } from '../types';
import { Modal } from './Modal';

type LoaderProps = {
    attributes: ImageLike;
    setAttributes: (attributes: ImageLike) => void;
    clientId?: string;
};

export const Loader = ({
    attributes,
    setAttributes,
    clientId,
}: LoaderProps) => {
    const [showModal, setShowModal] = useState(false);
    const { importing, setImporting, setLoading } = useGlobalState();
    const timerRef = useRef(0);
    const rafRef = useRef(0);

    useEffect(() => {
        const namespace = 'kevinbatdorf/stable-diffusion-open';
        const open = (event: CustomEvent<{ clientId: string }>) => {
            if (event?.detail?.clientId !== clientId) return;
            setShowModal(true);
        };
        window.addEventListener(namespace, open as (e: Event) => void);
        return () => {
            window.removeEventListener(namespace, open as (e: Event) => void);
        };
    }, [clientId]);

    // TODO: if the user has an image set, warn them we may replace it
    // attributes?.id

    const setImage = async (image: any) => {
        if (importing) return;
        const caption = 'The prompt the user typed';
        const newImage: WpImage | undefined = await importImage(
            'the image url',
            {
                alt: image?.alt_description ?? '',
                filename: `unsplash-image-${image.id}.jpg`,
                caption,
            },
        );
        if (!newImage) return;
        const getHref = (dest: string) => {
            if (dest === 'media') return newImage?.source_url;
            if (dest === 'attachment') return newImage?.link;
            return attributes?.href;
        };
        setAttributes({
            id: newImage.id,
            caption: newImage.caption.raw,
            linkDestination: attributes?.linkDestination ?? '',
            linkTarget: attributes?.linkTarget ?? '',
            linkClass: attributes?.linkClass ?? '',
            rel: attributes?.rel ?? '',
            href: getHref(attributes?.linkDestination ?? ''),
            url: newImage.source_url,
            alt: newImage.alt_text,
        });

        setImporting(__('Done!', 'stable-diffusion'));

        timerRef.current = window.setTimeout(() => {
            rafRef.current = window.requestAnimationFrame(() => {
                setShowModal(false);
            });
        }, 1000);
    };

    useLayoutEffect(() => {
        if (showModal) {
            setLoading(false);
            setImporting(false);
        }
        window.clearTimeout(timerRef.current);
        window.clearTimeout(rafRef.current);
    }, [showModal, setImporting, setLoading]);

    return (
        <Modal
            setImage={setImage}
            open={showModal}
            onClose={() => setShowModal(false)}
        />
    );
};
