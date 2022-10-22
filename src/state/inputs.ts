import create from 'zustand';
import { devtools } from 'zustand/middleware';

type InputsState = {
    prompt: string;
    width: number;
    height: number;
    numOutputs: number;
    setInput: (key: string, value: string | number) => void;
};

export const useInputsState = create<InputsState>()(
    devtools(
        (set) => ({
            prompt: '',
            initImage: '',
            width: 512,
            height: 512,
            numOutputs: 1,
            setInput(key: string, value: string | number) {
                set({ [key]: value });
            },
        }),
        { name: 'Block Diffusion User Inputs' },
    ),
);
