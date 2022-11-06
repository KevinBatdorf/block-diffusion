import { useEffect, useLayoutEffect, useState } from '@wordpress/element';
import { fabric } from 'fabric';
import { useCanvasState } from '../state/canvas';

const addRectangle = (fc: fabric.Canvas, options: fabric.IRectOptions) => {
    const rect = new fabric.Rect(options);
    fc?.add(rect);
    return rect;
};

const addText = (
    fc: fabric.Canvas,
    value: string,
    options: fabric.TextOptions,
) => {
    const text = new fabric.Text(value, options);
    fc?.add(text);
    return text;
};

const centerObject = (fc: fabric.Canvas, object: fabric.Object) => {
    fc.centerObject(object);
    fc.renderAll();
};

const deleteAll = (fc: fabric.Canvas) => {
    fc?.getObjects().forEach((object) => fc?.remove(object));
    fc?.discardActiveObject();
    fc?.renderAll();
};

const deleteSelected = (fc: fabric.Canvas) => {
    fc?.getActiveObjects().forEach((object) => fc?.remove(object));
    fc?.discardActiveObject();
    fc?.renderAll();
};

export const useFabric = (fc: fabric.Canvas | undefined): useFabricReturn => {
    const [selectedObjects, setSelectedObject] = useState<fabric.Object[]>([]);
    const { images } = useCanvasState();

    useEffect(() => {
        fc?.on('selection:cleared', () => {
            setSelectedObject([]);
        });
        fc?.on('selection:created', (e: fabric.IEvent) => {
            if (!e.selected) return;
            setSelectedObject(e.selected);
        });
        fc?.on('selection:updated', (e: fabric.IEvent) => {
            if (!e.selected) return;
            setSelectedObject(e.selected);
        });
    }, [fc]);

    useLayoutEffect(() => {
        if (!fc) return;
        // Get all images from canvas
        const canvasImages = fc?.getObjects().filter((object) => {
            return object.type === 'image';
        }) as fabric.Image[];

        // Remove images from canvas that are not in state
        canvasImages.forEach((image) => {
            if (!images.find((i) => i.cacheKey === image.cacheKey)) {
                fc?.remove(image);
            }
        });

        // Add images is needed
        images.forEach((image) => {
            if (!canvasImages.includes(image)) {
                image.set({
                    borderColor: '#1e1e1e',
                    cornerColor: '#1e1e1e',
                });
                fc?.add(image);
                fc.centerObject(image);
            }
        });
    }, [images, fc]);

    if (!fc) return { fc: undefined };

    return {
        selectedObjects,
        fc: {
            addRectangle: (options) => addRectangle(fc, options),
            addText: (text, options) => addText(fc, text, options),
            centerObject: (object) => centerObject(fc, object),
            deleteAll: () => deleteAll(fc),
            deleteSelected: () => deleteSelected(fc),
        },
    };
};

export type useFabricReturn = {
    fc?: {
        addRectangle: (props: fabric.IRectOptions) => fabric.Rect;
        addText: (text: string, props: fabric.TextOptions) => fabric.Text;
        centerObject: (object: fabric.Object) => void;
        deleteAll: () => void;
        deleteSelected: () => void;
    };
    selectedObjects?: fabric.Object[];
};
