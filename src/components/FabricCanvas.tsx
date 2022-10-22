import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { fabric } from 'fabric';

export interface Props {
    className?: string;
    onReady?: (canvas: fabric.Canvas) => void;
}

export const FabricCanvas = ({ className, onReady }: Props) => {
    const canvasEl = useRef(null);
    const [ready, setReady] = useState(false);
    const canvasElParent = useRef<HTMLDivElement>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas>();

    useLayoutEffect(() => {
        const setCurrentDimensions = () => {
            if (!canvas) return;
            canvas.setHeight(canvasElParent.current?.clientHeight || 0);
            canvas.setWidth(canvasElParent.current?.clientWidth || 0);
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
        setCanvas(new fabric.Canvas(canvasEl.current));
    }, []);

    useEffect(() => {
        if (ready && onReady && canvas) {
            onReady(canvas);
        }
    }, [ready, onReady, canvas]);

    return (
        <div ref={canvasElParent} className={className}>
            <canvas className="bg-red-500" ref={canvasEl} />
        </div>
    );
};
