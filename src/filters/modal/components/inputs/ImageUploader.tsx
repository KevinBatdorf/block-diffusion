import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { fabric } from 'fabric';
import { uploadImageIcon } from '../../icons';
import { useCanvasState } from '../../state/canvas';

type ImageUploaderProps = {
    disabled: boolean;
};
export const ImageUploader = ({ disabled }: ImageUploaderProps) => {
    const { addImage } = useCanvasState();

    return (
        <label htmlFor="stable-diffusion-image-upload" className="w-full">
            <span
                role="button"
                tabIndex={0}
                className={classNames(
                    'block-editor-block-types-list__item border border-gray-900 components-button duration-200 flex flex-col items-center outline-none relative transition-all gap-1',
                    {
                        'opacity-50': disabled,
                        'cursor-pointer hover:border-wp-theme-500 focus:border-wp-theme-500 hover:text-wp-theme-500 focus:text-wp-theme-500':
                            !disabled,
                    },
                )}>
                <Icon icon={uploadImageIcon} size={18} />
                <span>{__('Upload', 'stable-diffusion')}</span>
            </span>
            <input
                id="stable-diffusion-image-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={disabled}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            fabric.Image.fromURL(
                                fileReader.result as string,
                                (img) => {
                                    addImage(img);
                                },
                                { crossOrigin: 'anonymous' },
                            );
                        };
                    }
                }}
            />
        </label>
    );
};
