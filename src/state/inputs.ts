import create from 'zustand';
import { devtools } from 'zustand/middleware';

type InputsState = {
    prompt: string;
    width: number;
    height: number;
    setInput: (key: string, value: string | number) => void;
};

export const useInputsState = create<InputsState>()(
    devtools(
        (set) => ({
            prompt: '',
            width: 512,
            height: 512,
            setInput(key: string, value: string | number) {
                set({ [key]: value });
            },
        }),
        { name: 'Block Diffusion User Inputs' },
    ),
);