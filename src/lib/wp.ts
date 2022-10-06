import apiFetch from '@wordpress/api-fetch';
import { ImageLike, WpImage } from '../types';

export const loadImage = (img: HTMLImageElement) => {
    return new Promise((resolve) => (img.onload = resolve));
};

export const importImage = async (
    imageUrl: string,
    metadata: {
        alt?: string;
        filename: string;
        caption: string;
    },
): Promise<WpImage | undefined> => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = 'anonymous';
    await loadImage(image);

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image, 0, 0);

    const blob: Blob = await new Promise((resolve) => {
        canvas.toBlob((blob) => {
            blob && resolve(blob);
        }, 'image/jpeg');
    });

    const formData = new FormData();
    formData.append('file', new File([blob], metadata.filename));
    formData.append('alt_text', metadata.alt ?? '');
    formData.append('caption', metadata.caption ?? '');
    formData.append('status', 'publish');

    return await apiFetch({
        path: 'wp/v2/media',
        method: 'POST',
        body: formData,
    });
};

export const setImage = async (
    image: ImageLike,
): Promise<WpImage | undefined> => {
    return await importImage(image.url, {
        filename: `ai-prompt-${image.id}.jpg`,
        caption: image.caption,
    });
};

// eslint-disable-next-line
export const getSettings = async (name: string, defaultSettings: any) => {
    const allSettings = await apiFetch({ path: '/wp/v2/settings' });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    return allSettings?.[name] || { ...defaultSettings, version: 0 };
};
