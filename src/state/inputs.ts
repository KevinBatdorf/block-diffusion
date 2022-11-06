import create from 'zustand';
import { devtools } from 'zustand/middleware';

type InputsState = {
    prompt: string;
    width: number;
    height: number;
    numOutputs: number;
    initImage: string;
    setInput: (key: string, value: string | number) => void;
    resetInputs: () => void;
};
const initialState = {
    prompt: '',
    initImage: '',
    width: 512,
    height: 512,
    numOutputs: 1,
};
export const useInputsState = create<InputsState>()(
    devtools(
        (set) => ({
            ...initialState,
            setInput(key: string, value: string | number) {
                set({ [key]: value });
            },
            resetInputs() {
                set(initialState);
            },
        }),
        { name: 'Block Diffusion User Inputs' },
    ),
);
