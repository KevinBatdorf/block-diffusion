import { Icon } from '@wordpress/components';
import { Button } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { MediaUpload as MeidiaLibrary } from '@wordpress/media-utils';
import classNames from 'classnames';
import { fabric } from 'fabric';
import { uploadImageIcon } from '../../icons';
import { useCanvasState } from '../../state/canvas';
import { ImageLike } from '../../types';

type MediaUploaderProps = {
    disabled: boolean;
};
export const MediaUploader = ({ disabled }: MediaUploaderProps) => {
    const { addImage } = useCanvasState();
    const onUpdateImage = (image: ImageLike) => {
        fabric.Image.fromURL(
            image.url,
            (img) => {
                addImage(img);
            },
            { crossOrigin: 'anonymous' },
        );
    };

    return (
        <MediaUploadCheck>
            <MeidiaLibrary
                title={__('Select Image', 'stable-diffusion')}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore-next-line
                onSelect={onUpdateImage}
                allowedTypes={['image']}
                modalClass=""
                render={({ open }) => (
                    <Button
                        onClick={open}
                        className={classNames(
                            'block-editor-block-types-list__item border border-gray-900 components-button duration-200 flex flex-col items-center outline-none relative transition-all gap-1',
                            {
                                'opacity-50': disabled,
                                'cursor-pointer hover:border-wp-theme-500 focus:border-wp-theme-500 hover:text-wp-theme-500 focus:text-wp-theme-500':
                                    !disabled,
                            },
                        )}>
                        <Icon icon={uploadImageIcon} size={18} />
                        <span>{__('Media Library', 'stable-diffusion')}</span>
                    </Button>
                )}
            />
        </MediaUploadCheck>
    );
};

const MediaUploadCheck = ({ children }: { children: JSX.Element | null }) => {
    const cap = ['read', 'media'];
    const { loading, hasUploadPermissions } = useSelect((select) => {
        const core = select('core');
        return {
            // eslint-disable-next-line
            // @ts-ignore
            hasUploadPermissions: core.canUser('read', 'media'),
            // eslint-disable-next-line
            // @ts-ignore
            loading: !core.hasFinishedResolution('canUser', cap),
        };
    }, []);

    if (loading || !hasUploadPermissions) {
        return null;
    }

    return children;
};
