import { fabric } from 'fabric';
import create from 'zustand';
import { devtools } from 'zustand/middleware';

type CanvasState = {
    enabled: boolean;
    setEnabled: (enabled: boolean) => void;
    images: fabric.Image[];
    addImage: (image: fabric.Image) => void;
    removeImage: (image: fabric.Image) => void;
};

export const useCanvasState = create<CanvasState>()(
    devtools(
        (set, get) => ({
            enabled: false,
            setEnabled: (enabled) => set({ enabled }),
            images: [],
            addImage: (image: fabric.Image) => {
                // Currently only add one image at a time
                set({ images: [image] });
                // set({ images: [...get().images, image] });
            },
            removeImage: (image: fabric.Image) => {
                set({ images: get().images.filter((i) => i !== image) });
            },
        }),
        { name: 'Block Diffusion Canvas State' },
    ),
);
