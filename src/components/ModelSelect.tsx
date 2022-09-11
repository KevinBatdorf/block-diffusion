import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { models } from '../models';
import { AvailableModels } from '../types';
import { ModalCloseButton } from './ModalCloseButton';

type ModalProps = {
    open: boolean;
    setModel: (model: AvailableModels) => void;
    onClose: () => void;
};

export const ModalSelect = ({ open, setModel, onClose }: ModalProps) => (
    <AnimatePresence>
        {open && (
            <Dialog
                className="stable-diffusion-editor stable-diffusion-modal"
                static
                data-cy-up="main-modal"
                // initialFocus={initialFocus}
                as={motion.div}
                key="modal"
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                open={open}
                onClose={onClose}>
                <div className="absolute mx-auto w-full h-full md:p-8 flex justify-center items-center">
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
                        className="sm:flex w-full relative shadow-2xl sm:overflow-hidden max-w-xl bg-white">
                        <Dialog.Title className="sr-only">
                            {__('Select Model', 'stable-diffusion')}
                        </Dialog.Title>
                        <div className="flex flex-col w-full relative">
                            <div className="flex items-center justify-between w-full border-b p-4">
                                <div className="text-lg font-medium">
                                    {__(
                                        'Select a model to continue',
                                        'stable-diffusion',
                                    )}
                                </div>
                                <ModalCloseButton onClose={onClose} />
                            </div>
                            <div className="p-4 space-y-4">
                                {models.map((model) => (
                                    <ModelButton
                                        key={model.id}
                                        {...model}
                                        onClick={() =>
                                            setModel(
                                                model.id as AvailableModels,
                                            )
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Dialog>
        )}
    </AnimatePresence>
);

type ModelButtonProps = {
    name: string;
    description: string;
    active: boolean;
    onClick: () => void;
};
const ModelButton = ({
    name,
    description,
    active,
    onClick,
}: ModelButtonProps) => {
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
