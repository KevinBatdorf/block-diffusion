import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore-next-line
import image from '../assets/select.png';
import { models } from '../models';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { AvailableModels } from '../types';
import { ModalCloseButton } from './ModalCloseButton';

export const ModalSelect = () => {
    const { deleteApiToken, apiToken } = useAuthStore();
    const { setCurrentInterface, setShowSelectScreen, showSelectScreen } =
        useGlobalState();
    const onClose = () => setShowSelectScreen(false);

    return (
        <AnimatePresence>
            {Boolean(showSelectScreen) && (
                <Dialog
                    className="stable-diffusion-editor stable-diffusion-modal"
                    static
                    // initialFocus={initialFocus}
                    as={motion.div}
                    key="modal"
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    open={Boolean(showSelectScreen)}
                    onClose={onClose}>
                    <div className="absolute mx-auto w-full h-full md:p-8 flex flex-col justify-center items-center gap-2">
                        <div
                            className="fixed inset-0 bg-black/60"
                            aria-hidden="true"
                        />
                        <motion.div
                            key="modal"
                            id="stable-diffusion-modal-select-inner"
                            initial={{ y: 5 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="sm:flex w-full relative shadow-2xl sm:overflow-hidden max-w-screen-md2 bg-white">
                            <Dialog.Title className="sr-only">
                                {__('Select Model', 'stable-diffusion')}
                            </Dialog.Title>
                            <a
                                href="https://replicate.com/stability-ai/stable-diffusion?prediction=rjcl54wakbbrfcajzllmidreya"
                                target="_blank"
                                rel="noreferrer"
                                title="phase shift into an era of human+AI art collab"
                                className="w-full bg-cover aspect-square hidden md:block"
                                style={{ backgroundImage: `url(${image})` }}>
                                <span className="sr-only">
                                    phase shift into an era of human+AI art
                                    collab
                                </span>
                            </a>
                            <div className="flex flex-col w-full relative max-h-screen">
                                <div className="flex items-center justify-between w-full border-b p-4">
                                    <div className="text-lg font-medium">
                                        {__(
                                            'Select a model to continue',
                                            'stable-diffusion',
                                        )}
                                    </div>
                                    <ModalCloseButton onClose={onClose} />
                                </div>
                                <div className="p-4 space-y-4 overflow-y-scroll">
                                    {models.map((model) => (
                                        <ModelButton
                                            key={model.id}
                                            {...model}
                                            onClick={() =>
                                                setCurrentInterface(
                                                    model.id as AvailableModels,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        <div className="absolute bottom-8">
                            {Boolean(apiToken) && (
                                <button
                                    className="relative z-30 text-white bg-transparent focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 focus:shadow-none opacity-80 hover:opacity-100"
                                    onClick={deleteApiToken}>
                                    {__('Logout', 'stable-diffusion')}
                                </button>
                            )}
                        </div>
                    </div>
                </Dialog>
            )}
        </AnimatePresence>
    );
};
type ModelButtonProps = {
    name: string;
    description: string;
    active: boolean;
    hideFromList: boolean;
    onClick: () => void;
};
const ModelButton = ({
    name,
    description,
    active,
    hideFromList,
    onClick,
}: ModelButtonProps) => {
    if (hideFromList) return null;
    if (!active) {
        return (
            <div className="text-left w-full p-4 bg-gray-50 border border-gray-500">
                <span className="text-xs block uppercase font-bold mb-2 text-wp-theme-500">
                    {__('Coming Soon', 'stable-diffusion')}
                </span>
                <span className="font-medium text-lg mb-4 text-gray-900">
                    {name}
                </span>
                <p className="m-0 leading-tight text-gray-700">{description}</p>
            </div>
        );
    }
    return (
        <button
            className="text-left w-full p-4 bg-gray-50 hover:bg-gray-100 border border-gray-500 focus:outline-none focus:ring-1 ring-offset-1 ring-wp-theme-500 cursor-pointer focus:shadow-none"
            onClick={onClick}>
            <span className="font-medium text-lg mb-4 text-gray-900">
                {name}
            </span>
            <p className="m-0 leading-tight text-gray-700">{description}</p>
        </button>
    );
};
