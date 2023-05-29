import { ToggleControl } from '@wordpress/components';
import { useEffect, useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsTabs, useGlobalState } from '../state/global';
import { useSettingsStore } from '../state/settings';
import { ModalCloseButton } from './ModalControls';

export const SettingsModal = () => {
    const togglesRef = useRef<HTMLDivElement>(null);
    const { has, toggle } = useSettingsStore();
    const { setSettingsTab, settingsTab } = useGlobalState();
    useEffect(() => {
        if (!settingsTab) return;
        togglesRef.current?.querySelector('input')?.focus();
    }, [settingsTab]);
    return (
        <SettingsModalContainer
            tab={settingsTab}
            onClose={() => setSettingsTab(undefined)}>
            <section ref={togglesRef} className="flex flex-col gap-4">
                <div className="pb-4 border-b">
                    <h1 className="m-0 mb-2 text-xl">
                        {__('Features', 'stable-diffusion')}
                    </h1>
                    <p className="m-0">
                        {__(
                            'Enable or disable various features used through the application',
                            'stable-diffusion',
                        )}
                    </p>
                </div>
                <div>
                    <h2 className="m-0 mb-4">
                        {__('Prompts', 'stable-diffusion')}
                    </h2>
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
                        onChange={() => toggle('optIns', 'prompt-accept')}
                    />
                    <ToggleControl
                        checked={has('optIns', 'prompt-share')}
                        label={__('Enable prompt sharing', 'stable-diffusion')}
                        help={__(
                            'Share your prompts and images with the community',
                            'stable-diffusion',
                        )}
                        onChange={() => toggle('optIns', 'prompt-share')}
                    />
                </div>
                {/* temporary to fill space */}
                <div className="h-4" />
            </section>
        </SettingsModalContainer>
    );
};

const SettingsModalContainer = ({
    children,
    onClose,
    tab,
}: {
    children: React.ReactNode;
    onClose: () => void;
    tab?: SettingsTabs;
}) => (
    <Dialog
        className="stable-diffusion-editor stable-diffusion-modal"
        data-cy="modal-settings"
        key="modal-settings"
        open={Boolean(tab)}
        onClose={onClose}>
        <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <AnimatePresence>
                <motion.div
                    key="settings-modal"
                    initial={{ y: 5 }}
                    animate={{ y: 0 }}
                    exit={{ y: 0, opacity: 0 }}
                    className="sm:flex relative w-full shadow-2xl sm:overflow-hidden mx-auto bg-white max-w-screen-sm">
                    <Dialog.Title className="sr-only">
                        {__('Settings', 'stable-diffusion')}
                    </Dialog.Title>
                    <div className="md:flex flex-col w-full relative">
                        <div className="flex items-center justify-between w-full border-b gap-x-4 bg-white h-10">
                            <div className="font-mono font-semibold text-sm px-6">
                                {__('Settings', 'stable-diffusion')}
                            </div>
                            <ModalCloseButton onClose={onClose} />
                        </div>
                        <div className="flex gap-x-6 divide-x bg-gray-50">
                            <div className="w-32 py-6">
                                <nav className="flex flex-col">
                                    <button
                                        type="button"
                                        className={classNames(
                                            'bg-transparent text-gray-800 py-2 px-6 text-left w-full',
                                            {
                                                'font-semibold':
                                                    tab === 'optins',
                                            },
                                        )}>
                                        {__('Features', 'stable-diffusion')}
                                    </button>
                                    <button
                                        type="button"
                                        disabled
                                        className={classNames(
                                            'bg-transparent text-gray-800 py-2 px-6 text-left w-full',
                                            {
                                                'font-semibold':
                                                    tab === 'disables',
                                            },
                                        )}>
                                        {__('Coming soon', 'stable-diffusion')}
                                    </button>
                                </nav>
                            </div>
                            <div className="flex flex-col fex-grow gap-4 p-6 bg-white">
                                {children}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    </Dialog>
);
