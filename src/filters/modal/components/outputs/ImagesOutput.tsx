import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useGlobalState } from '../../state/global';
import { useInputsState } from '../../state/inputs';
import { ImageLike, PredictionData } from '../../types';
import { ImageActions } from './ImageActions';

type ImageOutputProps = {
    prediction?: PredictionData;
    setImage: (image: ImageLike) => void;
    resetState: () => void;
};

export const ImagesOutput = ({
    prediction,
    setImage,
    resetState,
}: ImageOutputProps) => {
    const { width, height, prompt } = useInputsState();
    const { id, output, input } = prediction || {};
    const { importingMessage } = useGlobalState();
    if (!output?.length) return null;
    return (
        <div
            className={classNames(
                'flex flex-col h-full w-full items-center pt-12 overflow-y-auto',
                {
                    'justify-center': output?.length === 1,
                    'pointer-events-none': importingMessage.length > 0,
                },
            )}>
            {output?.length > 1 && (
                <p className="font-mono m-0 mb-4 text-center">
                    {__('Hover over an image for options', 'stable-diffusion')}
                </p>
            )}
            <motion.div
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={classNames('gap-6 grid w-full self-start', {
                    'lg:grid-cols-2': output?.length >= 2,
                })}>
                {prediction?.output?.map((url, i) => (
                    <div
                        key={url}
                        className={classNames(
                            'flex items-center justify-center group',
                            {
                                'relative bg-gray-100': output?.length !== 1,
                            },
                        )}>
                        <div
                            className={classNames(
                                'w-full bg-no-repeat bg-contain',
                                {
                                    '': output?.length === 1,
                                },
                            )}
                            style={{
                                maxWidth: `${width}px`,
                                aspectRatio: `${width}/${height}`,
                                backgroundImage: `url(${url})`,
                            }}>
                            <ImageActions
                                id={`${id}-image-${i}`}
                                url={url}
                                caption={input?.prompt || prompt}
                                setImage={setImage}
                                forceShowHud={output?.length === 1}
                                callback={() => resetState()}
                            />
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};
