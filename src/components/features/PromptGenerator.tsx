import apiFetch from '@wordpress/api-fetch';
import { Icon, Tooltip, Popover, ToggleControl } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { previewImageIcon, refreshIcon } from '../../icons';
import { useSettingsStore, useSettingsStoreReady } from '../../state/settings';
import { PromptResponse } from '../../types';
import { ModalCloseButton } from '../ModalControls';

export const PromptGenerator = ({
    updateText,
}: {
    updateText: (text: string) => void;
}) => {
    const { has } = useSettingsStore();
    const ready = useSettingsStoreReady();
    const [fetching, setFetching] = useState(false);
    const [preview, setPreview] = useState<string>();
    const [showOptin, setShowOptin] = useState(false);

    const handlePress = async () => {
        if (!has('optIns', 'prompt-accept')) {
            setShowOptin(true);
            return;
        }
        if (fetching) return;
        setPreview(undefined);
        updateText('');
        setFetching(true);
        const { prompt, imageUrls } = await apiFetch<PromptResponse>({
            method: 'GET',
            path: `kevinbatdorf/stable-diffusion/prompt-suggestion?cache=${Date.now()}`,
        }).catch((e) => {
            setFetching(false);
            return { prompt: `Error: ${e.message}`, imageUrls: [] };
        });
        setFetching(false);
        if (!prompt) return;
        updateText(prompt);
        imageUrls?.length && setPreview(imageUrls[0]);
    };

    if (!ready || has('disabledFeatures', 'prompt-generator')) {
        return null;
    }
    return (
        <div className="flex gap-x-1 items-center">
            {/* // todo: I like the idea of opening a new modal and showing maybe 50 images and let the user pick an image they like */}
            <Tooltip
                text={__('Load prompt example', 'stable-diffusion')}
                position="top center">
                <button
                    className={classNames(
                        'block p-0 h-5 w-5 text-gray-900 bg-transparent cursor-pointer outline-none',
                        {
                            spin: fetching,
                            'focus:shadow-none focus:ring-wp focus:ring-wp-theme-500':
                                !fetching,
                        },
                    )}
                    type="button"
                    onClick={handlePress}
                    aria-label={__('Load prompt example', 'stable-diffusion')}>
                    <Icon icon={refreshIcon} size={18} />
                </button>
            </Tooltip>
            <AnimatePresence>
                <PreviewPopover url={preview} />
            </AnimatePresence>
            <Dialog
                className="stable-diffusion-editor stable-diffusion-modal"
                data-cy="modal-prompt-generator"
                key="modal-prompt-generator"
                open={showOptin}
                onClose={() => setShowOptin(false)}>
                <OptInPrompt
                    onClose={() => {
                        if (has('optIns', 'prompt-accept')) {
                            handlePress();
                        }
                        setShowOptin(false);
                    }}
                />
            </Dialog>
        </div>
    );
};

const PreviewPopover = ({ url }: { url?: string }) => {
    const [pressed, setPressed] = useState(false);
    useEffect(() => {
        setPressed(false);
    }, [url]);
    if (!url) return null;
    return (
        <Tooltip
            text={__('View prompt image', 'stable-diffusion')}
            position="top center">
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block p-0 h-5 w-5 text-gray-900 bg-transparent cursor-pointer outline-none"
                type="button"
                onClick={() => setPressed((v) => !v)}
                aria-label={__('View example image', 'stable-diffusion')}>
                <Icon icon={previewImageIcon} size={18} />
                {pressed && (
                    <Popover onFocusOutside={() => setPressed(false)}>
                        <img
                            src={url}
                            alt={__('Prompt image', 'stable-diffusion')}
                            style={{ minWidth: 300, maxWidth: 400 }}
                        />
                    </Popover>
                )}
            </motion.button>
        </Tooltip>
    );
};

const OptInPrompt = ({ onClose }: { onClose: () => void }) => {
    const { has, toggle } = useSettingsStore();
    const togglesRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        togglesRef.current?.querySelector('input')?.focus();
    }, []);
    return (
        <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <AnimatePresence>
                <motion.div
                    key="prompt-modal"
                    initial={{ y: 5 }}
                    animate={{ y: 0 }}
                    exit={{ y: 0, opacity: 0 }}
                    className="sm:flex relative w-full shadow-2xl sm:overflow-hidden mx-auto bg-white max-w-screen-xs">
                    <Dialog.Title className="sr-only">
                        {__('Opt-in to prompt generator', 'stable-diffusion')}
                    </Dialog.Title>
                    <div className="md:flex flex-col w-full relative">
                        <div className="flex items-center justify-between w-full border-b gap-x-4 bg-white px-6 h-10">
                            <div className="text-lg font-medium">
                                {__('Prompt Suggestions', 'stable-diffusion')}
                            </div>
                            <ModalCloseButton onClose={onClose} />
                        </div>
                        <div className="flex flex-col gap-4 p-6 pb-2">
                            <p className="text-sm m-0">
                                {__(
                                    'If enabled, pressing the generate icon will fetch random prompts and images to use as inspiration. This is a free service.',
                                )}
                            </p>
                            <div
                                ref={togglesRef}
                                className="p-4 pb-0 bg-gray-50 border border-gray-500">
                                <ToggleControl
                                    checked={has('optIns', 'prompt-accept')}
                                    label={__(
                                        'Enable prompt suggestions',
                                        'stable-diffusion',
                                    )}
                                    help={__(
                                        'Prompts and images may contain sensitive adult-themed content',
                                        'stable-diffusion',
                                    )}
                                    onChange={() =>
                                        toggle('optIns', 'prompt-accept')
                                    }
                                />
                                <ToggleControl
                                    checked={has('optIns', 'prompt-share')}
                                    label={__(
                                        'Enable prompt sharing',
                                        'stable-diffusion',
                                    )}
                                    help={__(
                                        'Share your prompts and images with the community',
                                        'stable-diffusion',
                                    )}
                                    onChange={() =>
                                        toggle('optIns', 'prompt-share')
                                    }
                                />
                            </div>
                            <p className="m-0 text-xs italic">
                                {__(
                                    'This feature is opt-in and can be disabled at any time from the settings area accessed from the toolbar.',
                                    'stable-diffusion',
                                )}
                            </p>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
