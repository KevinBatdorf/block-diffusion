import { useRef } from '@wordpress/element';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalDefault } from '../layouts/ModalDefault';
import { models } from '../models';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';
import { UserInferface } from './UserInterface';

type ModalProps = {
    setImage: (image: ImageLike) => void;
    onClose: () => void;
};

export const Modal = ({ setImage, onClose }: ModalProps) => {
    const { currentModel } = useGlobalState();
    const { apiToken } = useAuthStore();
    const name = models.find((m) => m.id === currentModel)?.name;
    const initialFocus = useRef(null);

    if (!name) return null;

    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            data-cy="model-screen"
            initialFocus={initialFocus}
            key="main-modal"
            open={Boolean(currentModel) && Boolean(apiToken)}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />
                <AnimatePresence>
                    <motion.div
                        key="main-modal"
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className="sm:flex relative shadow-2xl sm:overflow-hidden max-w-screen-2xl mx-auto bg-white h-full">
                        <Dialog.Title className="sr-only">{name}</Dialog.Title>
                        <div className="md:flex flex-col w-full relative h-screen md:h-auto">
                            <ModalDefault onClose={onClose} title={name}>
                                <UserInferface
                                    initialFocus={initialFocus}
                                    modelName={currentModel}
                                    setImage={setImage}
                                />
                            </ModalDefault>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};
