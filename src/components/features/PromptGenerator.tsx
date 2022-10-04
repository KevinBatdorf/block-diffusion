import apiFetch from '@wordpress/api-fetch';
import { Icon, Tooltip, Popover } from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { previewImageIcon, refreshIcon } from '../../icons';
import { useSettingsStore, useSettingsStoreReady } from '../../state/settings';
import { PromptResponse } from '../../types';

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
    const initialFocus = useRef<HTMLButtonElement>(null);

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
            <Tooltip text={__('Load prompt example', 'stable-diffusion')}>
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
                initialFocus={initialFocus}
                data-cy="modal-prompt-generator"
                key="modal-prompt-generator"
                open={showOptin}
                onClose={() => setShowOptin(false)}>
                <OptInPrompt onClose={() => setShowOptin(false)} />
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
        <Tooltip text={__('View prompt image', 'stable-diffusion')}>
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="block p-0 h-5 w-5 text-gray-900 bg-transparent cursor-pointer outline-none"
                type="button"
                onClick={() => setPressed((v) => !v)}
                aria-label={__('View example image', 'stable-diffusion')}>
                <Icon icon={previewImageIcon} size={18} />
                {pressed && (
                    <Popover>
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
    return (
        <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                aria-hidden="true"
            />
            <AnimatePresence>
                <motion.div
                    key="modal"
                    id="stable-diffusion-modal-inner"
                    initial={{ y: 5 }}
                    animate={{ y: 0 }}
                    exit={{ y: 0, opacity: 0 }}
                    className="sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white">
                    <Dialog.Title className="sr-only">
                        {__('Opt-in to prompt generator', 'stable-diffusion')}
                    </Dialog.Title>
                    <div className="md:flex flex-col w-full relative h-screen md:h-auto">
                        ok
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
