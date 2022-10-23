import { Icon } from '@wordpress/components';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { fabric } from 'fabric';
import { AnimatePresence, motion } from 'framer-motion';
import { useFabric } from '../hooks/useFabric';
import { zoomInIcon, zoomOutIcon } from '../icons';
import { downloadImage, copyImage } from '../lib/image';
import { useGlobalState } from '../state/global';
import { useInputsState } from '../state/inputs';
import { ImageLike, PredictionData } from '../types';
import { FabricCanvas } from './FabricCanvas';

type MainPanelProps = {
    prediction?: PredictionData;
    setImage: (image: ImageLike) => void;
};

const animateMainRect = (
    canvas: fabric.Canvas,
    mainRect: fabric.Rect,
    width: number,
    height: number,
) => {
    mainRect.animate(
        { width, height },
        {
            easing: fabric.util.ease.easeOutCubic,
            duration: 200,
            onChange: () => {
                canvas.centerObject(mainRect);
                canvas.renderAll();
            },
        },
    );
};

export const MainPanel = ({ setImage, prediction }: MainPanelProps) => {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [mainRect, setMainRect] = useState<fabric.Rect>();
    const [hwText, setHwText] = useState<fabric.Text>();
    const [zoom, setZoom] = useState(1);
    const { width, height } = useInputsState();
    const { fc } = useFabric(canvas);

    useLayoutEffect(() => {
        // Only add this once
        if (!fc || mainRect) return;
        const rect = fc.addRectangle({
            stroke: '#1e1e1e',
            fill: 'transparent',
            selectable: false,
            hoverCursor: 'default',
            width,
            height,
        });
        setMainRect(rect);
        fc.centerObject(rect);
    }, [fc, width, height, mainRect]);

    useLayoutEffect(() => {
        if (!mainRect || !canvas) return;
        const update = () => {
            animateMainRect(canvas, mainRect, width, height);
        };
        update();
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('resize', update);
        };
    }, [width, height, mainRect, canvas]);

    useLayoutEffect(() => {
        // Only add this once
        if (!fc || hwText) return;
        const text = fc.addText(`${width} x ${height}`, {
            stroke: 'none',
            fill: '#f0f0f0',
            selectable: false,
            hoverCursor: 'default',
            fontFamily: 'monospace',
            fontSize: 18,
        });
        setHwText(text);
        fc.centerObject(text);
    }, [fc, width, height, hwText]);

    useLayoutEffect(() => {
        if (!hwText || !canvas) return;
        hwText.set('text', `${width} x ${height}`);
    }, [width, height, hwText, canvas]);

    useEffect(() => {
        if (!canvas || !mainRect) return;
        canvas.zoomToPoint(mainRect.getCenterPoint(), zoom);
    }, [zoom, canvas, mainRect]);

    return (
        <>
            <div className="h-full w-full relative flex justify-center">
                <AnimatePresence>
                    <FabricCanvas
                        className="w-full h-full"
                        onReady={setCanvas}
                    />
                    {/* <MainPanelInner setImage={setImage} prediction={prediction} /> */}
                </AnimatePresence>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                <button
                    className="bg-gray-100 p-2 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 hover:text-white transition-all duration-200"
                    onClick={() => setZoom((canvas?.getZoom() ?? 0) - 0.1)}
                    aria-label={__('Zoom out', 'stable-diffusion')}>
                    <Icon icon={zoomOutIcon} size={18} />
                </button>
                <div>
                    {canvas && (
                        <span className="w-20 bg-gray-100 text-xs h-full flex items-center justify-center">
                            {Math.round(zoom * 100)}%
                        </span>
                    )}
                </div>
                <button
                    className="bg-gray-100 p-2 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 hover:text-white transition-all duration-200"
                    onClick={() => setZoom((canvas?.getZoom() ?? 0) + 0.1)}
                    aria-label={__('Zoom in', 'canvas')}>
                    <Icon icon={zoomInIcon} size={18} />
                </button>
            </div>
        </>
    );
};

// Separate out depending on if there is init_image or not. Use the old if not
// Redo minimal starting image buttons
// Add image to canvas and let it be selectable, removed, etc
// add import button to prompt preview, prediction
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
