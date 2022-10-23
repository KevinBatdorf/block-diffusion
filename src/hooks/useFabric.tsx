import { useEffect, useState } from '@wordpress/element';
import { fabric } from 'fabric';

const addRectangle = (fc: fabric.Canvas, options: fabric.IRectOptions) => {
    console.log({ options, fc });
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
