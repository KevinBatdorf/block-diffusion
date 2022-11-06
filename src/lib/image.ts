export const loadImage = (img: HTMLImageElement) => {
    return new Promise((resolve) => (img.onload = resolve));
};

export const imageUrlToBlob = async (imageUrl: string): Promise<Blob> => {
    const image = new Image();
    image.src = imageUrl;
    image.crossOrigin = 'anonymous';
    await loadImage(image);

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }
    ctx.drawImage(image, 0, 0);

    return await new Promise((resolve) => {
        canvas.toBlob((blob) => {
            blob && resolve(blob);
        }, 'image/png');
    });
};

export const downloadImage = async (url: string, filename: string) => {
    const blob = await imageUrlToBlob(url);
    const dataUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(dataUrl);
};

export const copyImage = async (url: string) => {
    const blob = await imageUrlToBlob(url);
    navigator.clipboard.write([
        new ClipboardItem({
            [blob.type]: blob,
        }),
    ]);
};
