import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { fabric } from 'fabric';
import { downloadImage, copyImage } from '../../../../lib/image';
import { ImageLike } from '../../../../types';
import { useCanvasState } from '../../state/canvas';
import { useGlobalState } from '../../state/global';

type ActionProps = {
    id: string;
    url: string;
    caption: string;
    forceShowHud?: boolean;
    setImage?: (image: ImageLike) => void;
    callback?: () => void;
};
export const ImageActions = ({
    setImage,
    id,
    url,
    caption,
    forceShowHud,
    callback,
}: ActionProps) => {
    const { addImage, enabled: canvasEnabled } = useCanvasState();
    const btnClass =
        'bg-gray-900 text-white p-2 px-4 text-left outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 transition-all duration-200';
    const { setImportingMessage } = useGlobalState();
    const handleImport = () => {
        if (!id || !setImage) return;
        setImage({ id, url, caption });
    };
    const handleAddToCanvas = () => {
        if (!id) return;
        fabric.Image.fromURL(
            url,
            (img) => {
                addImage(img);
                callback?.();
            },
            { crossOrigin: 'anonymous' },
        );
    };
    const handleDownload = async () => {
        await downloadImage(url, `block-diffusion-${id}`);
    };
    const handleCopy = async () => {
        setImportingMessage(__('Copying...', 'stable-diffusion'));
        await copyImage(url);
        setImportingMessage('');
    };
    return (
        <div
            className={classNames(
                'absolute top-0 left-0 flex flex-col items-start gap-1 pt-1 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300',
                {
                    'lg:opacity-0': !forceShowHud,
                },
            )}
            style={{
                background:
                    'radial-gradient(100% 65px at left top, rgb(255 255 255 / 65%) 0px, rgb(0 0 0 / 0%))',
            }}>
            {setImage && (
                <button
                    className={btnClass}
                    onClick={handleImport}
                    type="button">
                    {__('Import into editor', 'stable-diffusion')}
                </button>
            )}
            {canvasEnabled && (
                <button
                    className={btnClass}
                    onClick={handleAddToCanvas}
                    type="button">
                    {__('Add to canvas', 'stable-diffusion')}
                </button>
            )}
            <button className={btnClass} onClick={handleDownload} type="button">
                {__('Download', 'stable-diffusion')}
            </button>
            {/* requires ssl */}
            {navigator.clipboard && (
                <button className={btnClass} onClick={handleCopy} type="button">
                    {__('Copy', 'stable-diffusion')}
                </button>
            )}
        </div>
    );
};
