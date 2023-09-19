import { Icon } from '@wordpress/components';
import { useEffect, useLayoutEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { fabric } from 'fabric';
import { IEvent } from 'fabric/fabric-impl';
import { AnimatePresence } from 'framer-motion';
import { zoomInIcon, zoomOutIcon } from '../../../../icons';
import { PredictionData } from '../../../../types';
import { useFabric } from '../../hooks/useFabric';
import { useCanvasState } from '../../state/canvas';
import { useInputsState } from '../../state/inputs';
import { FabricCanvas } from '../FabricCanvas';

const animateMainRect = (
    canvas: fabric.Canvas,
    mainRect: fabric.Rect,
    width: number,
    height: number,
    setInput: (key: string, value: string) => void,
) => {
    mainRect.animate(
        { width, height },
        {
            easing: fabric.util.ease.easeOutCubic,
            duration: 200,
            onChange: () => {
                canvas.centerObject(mainRect);
                canvas.renderAll();
                handleUpdateInitInput(canvas, mainRect, setInput);
            },
        },
    );
};

const handleUpdateInitInput = (
    canvas?: fabric.Canvas,
    mainRect?: fabric.Rect,
    setInput?: (key: string, value: string) => void,
) => {
    if (!canvas || !mainRect) return;
    // check if canvas has images
    const canvasImages = canvas?.getObjects().filter((object) => {
        return object.type === 'image';
    });
    if (!canvasImages?.length && setInput) {
        // If no images on the canvas, no init image
        setInput('initImage', '');
        return;
    }
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            canvas.renderAll();
            const url = canvas.toDataURL({
                left: (mainRect?.left ?? -1) + 1,
                top: (mainRect?.top ?? -1) + 1,
                width: (mainRect.width ?? 1) - 1,
                height: (mainRect.height ?? 1) - 1,
            });
            setInput && setInput('initImage', url);
        });
    });
};

export const CanvasPanel = ({
    prediction,
}: {
    prediction: PredictionData | undefined;
}) => {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [mainRect, setMainRect] = useState<fabric.Rect>();
    const [zoom, setZoom] = useState(1);
    const { width, height, setInput } = useInputsState();
    const { images, setEnabled } = useCanvasState();
    const { fc } = useFabric(canvas);
    const hasOutputs =
        prediction?.status === 'succeeded' && prediction?.output?.length;
    const handleSnapToGrid = ({ target }: IEvent) => {
        if (
            target?.left &&
            target?.top &&
            mainRect?.left &&
            mainRect?.top &&
            Math.abs(target.left - mainRect.left) < 16 &&
            Math.abs(target.top - mainRect.top) < 16
        ) {
            target.set({
                left: mainRect.left + 1,
                top: mainRect.top + 1,
            });
        }
    };

    useLayoutEffect(() => {
        // Only add this once
        if (!fc || mainRect) return;
        const rect = fc.addRectangle({
            stroke: '#1e1e1e',
            fill: 'transparent',
            selectable: false,
            perPixelTargetFind: true,
            hoverCursor: 'default',
            width: width + 2,
            height: height + 2,
        });
        setMainRect(rect);
        fc.centerObject(rect);
    }, [fc, width, height, mainRect]);

    useLayoutEffect(() => {
        if (!mainRect || !canvas) return;
        const update = () => {
            animateMainRect(canvas, mainRect, width, height, setInput);
        };
        update();
        window.addEventListener('resize', update);
        return () => {
            window.removeEventListener('resize', update);
        };
    }, [width, height, mainRect, canvas, setInput]);

    useLayoutEffect(() => {
        if (!canvas || !mainRect) return;
        canvas.bringToFront(mainRect);
    }, [images, canvas, mainRect]);

    useEffect(() => {
        setEnabled(true);
        return () => setEnabled(false);
    }, [setEnabled]);

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
                        onObjectAdded={() =>
                            handleUpdateInitInput(canvas, mainRect, setInput)
                        }
                        onObjectModified={() =>
                            handleUpdateInitInput(canvas, mainRect, setInput)
                        }
                        onObjectRemoved={() =>
                            handleUpdateInitInput(canvas, mainRect, setInput)
                        }
                        onObjectMoving={handleSnapToGrid}
                    />
                </AnimatePresence>
            </div>
            {hasOutputs ? null : (
                <div className="flex flex-col items-center justify-center gap-1 absolute bottom-0 left-0 right-0">
                    <div>{`${width} x ${height}`}</div>
                    <div className="flex justify-center">
                        <button
                            className="bg-gray-100 p-2 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 cursor-pointer hover:bg-wp-theme-500 hover:text-white transition-all duration-200"
                            onClick={() =>
                                setZoom((canvas?.getZoom() ?? 0) - 0.1)
                            }
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
                            onClick={() =>
                                setZoom((canvas?.getZoom() ?? 0) + 0.1)
                            }
                            aria-label={__('Zoom in', 'canvas')}>
                            <Icon icon={zoomInIcon} size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
