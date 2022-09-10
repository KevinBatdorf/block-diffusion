import { useRef } from '@wordpress/element';
import { useGlobalState } from '../state/global';

type MondalContentProps = {
    setImage: (image: any) => void;
};

export const ModalContent = ({ setImage }: MondalContentProps) => {
    const { loading } = useGlobalState();
    const gridRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={gridRef} className="w-full relative h-full overflow-y-scroll">
            heyyy {loading}
        </div>
    );
};
