import { useRef } from '@wordpress/element';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
};

export const StableDiffusion = ({ setImage }: StableDiffusionProps) => {
    const { loading } = useGlobalState();
    const gridRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={gridRef} className="w-full relative h-full overflow-y-scroll">
            heyyy {loading}
        </div>
    );
};
