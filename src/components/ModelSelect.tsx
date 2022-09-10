import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AvailableModels, ModelAttributes } from '../types';
import { ModalCloseButton } from './ModalCloseButton';

type ModalProps = {
    open: boolean;
    setModel: (model: AvailableModels) => void;
    onClose: () => void;
};

export const ModalSelect = ({ open, setModel, onClose }: ModalProps) => {
    const models: ModelAttributes[] = [
        {
            id: 'stability-ai/stable-diffusion',
            name: __('AI Prompt To Image', 'stable-diffusion'),
            description: __(
                'A latent text-to-image diffusion model capable of generating photo-realistic images given any text input',
                'stable-diffusion',
            ),
            active: true,
        },
        {
            id: 'tencentarc/gfpgan',
            name: __('Reverse Image To Prompt', 'stable-diffusion'),
            description: __(
                'Get an approximate text prompt, with style, matching an image that you provide',
                'stable-diffusion',
            ),
            active: false,
        },
        {
            id: 'methexis-inc/img2prompt',
            name: __('Face Restoration', 'stable-diffusion'),
            description: __(
                'Practical face restoration algorithm for *old photos* or *AI-generated faces*',
                'stable-diffusion',
            ),
            active: false,
        },
        {
            id: 'deforum/deforum_stable_diffusion',
            name: __('AI Prompt Animation', 'stable-diffusion'),
            description: __(
                'Animating prompts with stable diffusion',
                'stable-diffusion',
            ),
            active: false,
        },
    ];

    return (
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
                            className="fixed inset-0 bg-black/40"
                            aria-hidden="true"
                        />
                        <motion.div
                            key="modal"
                            id="stable-diffusion-modal-select-inner"
                            initial={{ y: 30 }}
                            animate={{ y: 0 }}
                            exit={{ y: 0, opacity: 0 }}
                            className="sm:flex w-full relative shadow-2xl sm:overflow-hidden max-w-xl bg-white">
                            <Dialog.Title className="sr-only">
                                {__(
                                    'Select Diffusion Model',
                                    'stable-diffusion',
                                )}
                            </Dialog.Title>
                            <div className="flex flex-col w-full relative">
                                <div className="flex items-center justify-between w-full border-b p-4">
                                    <div className="text-lg font-medium">
                                        {__(
                                            'Select a model to run',
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
};

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
