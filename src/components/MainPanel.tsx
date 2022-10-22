import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { useFabricJSEditor } from 'fabricjs-react';
import { AnimatePresence, motion } from 'framer-motion';
import { downloadImage, copyImage } from '../lib/image';
import { useGlobalState } from '../state/global';
import { useInputsState } from '../state/inputs';
import { ImageLike, PredictionData } from '../types';
import { FabricCanvas } from './FabricCanvas';

type MainPanelProps = {
    prediction?: PredictionData;
    setImage: (image: ImageLike) => void;
};

export const MainPanel = ({ setImage, prediction }: MainPanelProps) => {
    const { editor, onReady } = useFabricJSEditor();

    useEffect(() => {
        console.log({ editor });
    }, [editor]);
    return (
        <div className="bg-gray-50 flex flex-col h-full items-center overflow-y-auto p-6 w-full relative">
            <AnimatePresence>
                <FabricCanvas className="w-full h-full" onReady={onReady} />
                {/* <MainPanelInner setImage={setImage} prediction={prediction} /> */}
            </AnimatePresence>
        </div>
    );
};

//
//
//
//
const MainPanelInner = ({ prediction, setImage }: MainPanelProps) => {
    const { width, height, prompt } = useInputsState();
    const { id, output, input } = prediction || {};
    const { importingMessage } = useGlobalState();

    if (prediction?.status === 'succeeded' && output?.length) {
        return (
            <div
                className={classNames(
                    'flex flex-col h-full w-full items-center',
                    {
                        'pointer-events-none': importingMessage.length > 0,
                    },
                )}>
                {output?.length > 1 && (
                    <p className="font-mono m-0 mb-4 text-center">
                        {__(
                            'Hover over an image for options',
                            'stable-diffusion',
                        )}
                    </p>
                )}
                <motion.div
                    key={prediction.id}
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
                                    'relative bg-gray-100':
                                        output?.length !== 1,
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
                                />
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        );
    }
    const imageOutput = {
        maxWidth: `${width}px`,
        maxHeight: 'calc(100% - 2.5rem)',
        aspectRatio: `${width}/${height}`,
    };
    return (
        <motion.div
            key="canvas-placeholder"
            role="button"
            transition={{ type: 'Tween' }}
            className="border border-gray-500 flex items-center justify-center bg-cover m-auto"
            animate={imageOutput}
            initial={imageOutput}>
            <div className="w-screen" />
        </motion.div>
    );
};

type ActionProps = {
    id: string;
    url: string;
    caption: string;
    forceShowHud?: boolean;
    setImage: (image: ImageLike) => void;
};
const ImageActions = ({
    setImage,
    id,
    url,
    caption,
    forceShowHud,
}: ActionProps) => {
    const btnClass =
        'bg-gray-900 text-white p-2 px-4 text-left outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 transition-all duration-200';
    const { setImportingMessage } = useGlobalState();
    const handleImport = () => {
        if (!id) return;
        setImage({ id, url, caption });
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
            <button className={btnClass} onClick={handleImport} type="button">
                {__('Import into editor', 'stable-diffusion')}
            </button>
            <button className={btnClass} onClick={handleDownload} type="button">
                {__('Download', 'stable-diffusion')}
            </button>
            <button className={btnClass} onClick={handleCopy} type="button">
                {__('Copy', 'stable-diffusion')}
            </button>
        </div>
    );
};
