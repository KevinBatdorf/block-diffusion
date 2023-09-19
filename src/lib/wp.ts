import apiFetch from '@wordpress/api-fetch';
import { ImageLike, WpImage } from '../types';
import { imageUrlToBlob } from './image';

export const importImage = async (
    imageUrl: string,
    metadata: {
        alt?: string;
        filename: string;
        caption: string;
    },
): Promise<WpImage | undefined> => {
    const blob = await imageUrlToBlob(imageUrl);

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
