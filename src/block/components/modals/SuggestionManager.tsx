import { Snackbar, Icon } from '@wordpress/components';
import { useState, useEffect, useRef, RefObject } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SimpleDialog } from '../../../components/SimpleDialog';
import { closeXIcon } from '../../../icons';
import { PromptSuggestion } from '../../../types';
import { useSuggestions } from '../../state/suggestions';

export const SuggestionManager = () => {
    const { showModal, setModal, add, remove, prompts, has } = useSuggestions();
    const [toast, setToast] = useState<string>();
    const initialFocus = useRef<HTMLInputElement>(null);

    const handleSubmit = (prompt: PromptSuggestion) => {
        if (has(prompt.label)) return;
        add(prompt);
        setToast(__('Suggestion added.', 'stable-diffusion'));
    };

    const handleRemove = (label: PromptSuggestion['label']) => {
        remove(label);
        setToast(__('Suggestion removed.', 'stable-diffusion'));
    };

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(undefined), 5000);
        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        const handle = () => setModal(true);
        const event = 'stable-diffusion-open-suggestions-modal';
        window.addEventListener(event, handle);
        return () => window.removeEventListener(event, handle);
    }, [setModal]);

    return (
        <>
            <SimpleDialog
                open={showModal}
                testingId="login-screen"
                disablePadding
                onClose={() => {
                    setModal(false);
                }}
                maxHeight={500}
                maxWClass="max-w-screen-md"
                title={__('Prompt Suggestions', 'stable-diffusion')}
                initialFocus={initialFocus}>
                <div className="flex overflow-hidden">
                    <div className="w-full max-w-xs relative m-6 flex flex-col gap-4">
                        <TheForm
                            onSubmit={handleSubmit}
                            initialFocus={initialFocus}
                        />
                        <p className="m-0 italic text-sm">
                            {__(
                                'Adding or removing prompts here will not affect existing blocks. You must go back and add/remove them individually.',
                                'stable-diffusion',
                            )}
                        </p>
                    </div>
                    <div className="w-full flex-grow flex flex-col gap-4 overflow-y-auto p-6">
                        {prompts.length > 0 ? (
                            prompts.map(({ label, text }) => (
                                <div
                                    key={label}
                                    className="bg-gray-100 p-2 pr-8 relative shadow">
                                    <h2 className="font-medium text-md m-0 p-0 mb-1">
                                        {label}
                                    </h2>
                                    <div className="text-sm text-gray-700">
                                        {text}
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-900 bg-transparent p-1 absolute top-0 right-0 cursor-pointer border-0"
                                        onClick={() => handleRemove(label)}>
                                        <Icon icon={closeXIcon} size={10} />
                                        <span className="sr-only">
                                            {__('Remove', 'stable-diffusion')}
                                        </span>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col justify-center items-center h-full">
                                <div className="text-gray-500 text-center">
                                    {__(
                                        'No suggestions yet.',
                                        'stable-diffusion',
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SimpleDialog>
            {toast && <SuccessToast text={toast} />}
        </>
    );
};

const SuccessToast = ({ text }: { text: string }) => (
    <div className="block-diffusion-editor">
        <div className="w-full fixed bottom-4 left-0 right-0 px-4 flex justify-end z-max pointer-events-none">
            <div className="shadow-2xl" data-cy="login-success-toast">
                <Snackbar>{text}</Snackbar>
            </div>
        </div>
    </div>
);

type FormProps = {
    initialFocus: RefObject<HTMLInputElement>;
    onSubmit: (prompt: PromptSuggestion) => void;
};
const TheForm = ({ onSubmit, initialFocus }: FormProps) => {
    const [error, setError] = useState('');
    const [text, setText] = useState('');
    const [label, setLabel] = useState('');

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                setError('');
                if (!label || !text) {
                    return setError(
                        __('Please fill in all fields.', 'stable-diffusion'),
                    );
                }
                const prompt: PromptSuggestion = { label, text };
                setText('');
                setLabel('');
                onSubmit(prompt);
            }}>
            <div>
                <label
                    htmlFor="suggestion-label"
                    className="font-medium block mb-0.5 text-sm">
                    {__('Prompt Label', 'stable-diffusion')}
                </label>
                <input
                    ref={initialFocus}
                    id="suggestion-label"
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full rounded-none border border-gray-900 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500"
                />
            </div>
            <div>
                <label
                    htmlFor="suggestion-text"
                    className="font-medium block mb-0.5 text-sm">
                    {__('Prompt Text', 'stable-diffusion')}
                </label>
                <textarea
                    id="suggestion-text"
                    rows={4}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-none border border-gray-900 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500"
                />
            </div>
            <div>
                <button
                    type="submit"
                    data-cy="add-suggestion-button"
                    className="h-10 px-4 bg-gray-900 text-white rounded-none border border-gray-900 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 cursor-pointer focus:shadow-none">
                    {__('Add Suggestion', 'stable-diffusion')}
                </button>
            </div>
            {error && (
                <div className="p-2 bg-wp-alert-yellow mb-4">{error}</div>
            )}
        </form>
    );
};
