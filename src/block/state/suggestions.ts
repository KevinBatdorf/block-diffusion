import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PromptSuggestion } from '../../types';

type SuggestionState = {
    showModal: boolean;
    setModal: (showModal: boolean) => void;
    prompts: PromptSuggestion[];
    has: (promptLabel: string) => boolean;
    add: (prompt: PromptSuggestion) => void;
    remove: (promptLabel: string) => void;
};
const initialState = {
    showModal: false,
    prompts: [
        {
            label: 'This is a prompt',
            text: 'This is the text of the prompt',
        },
        {
            label: 'This is another prompt',
            text: 'This is the text of the prompt',
        },
    ],
};
export const useSuggestions = create<SuggestionState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,
                setModal(showModal: boolean) {
                    set({ showModal });
                },
                has(promptLabel: string) {
                    return get().prompts.some((p) => p.label === promptLabel);
                },
                add(prompt: PromptSuggestion) {
                    if (get().has(prompt.label)) return;
                    set((state) => ({ prompts: [prompt, ...state.prompts] }));
                },
                remove(promptLabel: string) {
                    set((state) => ({
                        prompts: state.prompts.filter(
                            (p) => p.label !== promptLabel,
                        ),
                    }));
                },
            }),
            {
                name: 'block-diffusion-suggestions',
                // remove showModal
                partialize: (state) => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { showModal, ...rest } = state;
                    return rest;
                },
            },
        ),
        { name: 'Block Diffusion Suggestions' },
    ),
);
