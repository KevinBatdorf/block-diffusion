import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { colord } from 'colord';
import { fabric } from 'fabric';
import type { IEvent } from 'fabric/fabric-impl';

export interface Props {
    className?: string;
    onReady?: (canvas: fabric.Canvas) => void;
    onBeforeRender?: () => void;
    onObjectAdded?: () => void;
    onObjectModified?: () => void;
    onObjectRemoved?: () => void;
    onObjectMoving?: (event: IEvent) => void;
}

export const FabricCanvas = ({
    className,
    onReady,
    onBeforeRender,
    onObjectAdded,
    onObjectModified,
    onObjectRemoved,
    onObjectMoving,
}: Props) => {
    const canvasEl = useRef(null);
    const [ready, setReady] = useState(false);
    const canvasElParent = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>(undefined);

    useEffect(() => {
        if (!canvas) return;
        const handleOnKeyDown = (event: KeyboardEvent) => {
            if (!canvas.getActiveObject()) return;
            // If the canvas is active, the body has focus. Retrun if not active
            if (document.body !== document.activeElement) return;
            const obj = canvas?.getActiveObject();
            if (!obj) return;
            ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].forEach(
                (key) => {
                    if (event.key === key) {
                        const inc = event.shiftKey ? 10 : 1;
                        event.preventDefault();
                        event.stopPropagation();
                        if (key === 'ArrowUp' && obj?.top) obj.top -= inc;
                        if (key === 'ArrowDown' && obj?.top) obj.top += inc;
                        if (key === 'ArrowLeft' && obj?.left) obj.left -= inc;
                        if (key === 'ArrowRight' && obj?.left) obj.left += inc;
                        canvas.renderAll();
                    }
                },
            );
            if (event.key === 'Delete' || event.key === 'Backspace') {
                event.preventDefault();
                event.stopPropagation();
                canvas.remove(obj);
            }
        };
        document.addEventListener('keydown', handleOnKeyDown);
        return () => {
            document.removeEventListener('keydown', handleOnKeyDown);
        };
    }, [canvas]);

    useLayoutEffect(() => {
        if (!canvas) return;
        const setCurrentDimensions = () => {
            if (!canvas) return;
            canvas.setHeight(canvasElParent.current?.clientHeight ?? 0);
            canvas.setWidth(canvasElParent.current?.clientWidth ?? 0);
            canvas.renderAll();
        };
        setCurrentDimensions();
        window.addEventListener('resize', setCurrentDimensions, false);
        setReady(true);

        return () => {
            canvas && canvas.dispose();
            window.removeEventListener('resize', setCurrentDimensions);
        };
    }, [canvas]);

    useEffect(() => {
        if (!canvasEl.current) return;
        // Get admin theme color from variable
        const adminColor = getComputedStyle(document.body).getPropertyValue(
            '--wp-admin-theme-color',
        );
        const color = colord(adminColor).alpha(0.5).toHex();
        setCanvas(
            new fabric.Canvas(canvasEl.current, {
                selectionColor: color,
                selectionBorderColor: '#1e1e1e',
                preserveObjectStacking: true,
                enableRetinaScaling: false,
            }),
        );
    }, [setCanvas]);

    useEffect(() => {
        if (ready && onReady && canvas) {
            onReady(canvas);
        }
        const objectAdded = () => onObjectAdded && onObjectAdded();
        const objectModified = () => onObjectModified && onObjectModified();
        const objectRemoved = () => onObjectRemoved && onObjectRemoved();
        const beforeRender = () => onBeforeRender && onBeforeRender();
        const objectMoving = (event: IEvent) =>
            onObjectMoving && onObjectMoving(event);
        canvas?.on('object:added', objectAdded);
        canvas?.on('object:modified', objectModified);
        canvas?.on('object:removed', objectRemoved);
        canvas?.on('before:render', beforeRender);
        canvas?.on('object:moving', objectMoving);
        return () => {
            canvas?.off('object:added', objectAdded);
            canvas?.off('object:modified', objectModified);
            canvas?.off('object:removed', objectRemoved);
            canvas?.off('before:render', beforeRender);
            canvas?.off('object:moving', objectMoving);
        };
    }, [
        ready,
        onReady,
        canvas,
        onBeforeRender,
        onObjectAdded,
        onObjectModified,
        onObjectRemoved,
        onObjectMoving,
    ]);

    return (
        <div ref={canvasElParent} className={className}>
            <canvas ref={canvasEl} />
        </div>
    );
};
