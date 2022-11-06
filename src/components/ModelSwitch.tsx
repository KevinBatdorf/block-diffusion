import { useRef } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dialog } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { models } from '../models';
import { useGlobalState } from '../state/global';
import { ModalCloseButton } from './ModalControls';
import { FocusHelperButton } from './misc/FocusHelperButton';

export const ModelSwitch = () => {
    const { goToModel } = useGlobalState();
    const initialFocus = useRef<HTMLButtonElement>(null);

    return (
        <ModalContainer initialFocus={initialFocus}>
            <FocusHelperButton initialFocus={initialFocus} />
            <div
                data-cy="model-switch-grid"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 h-screen md:h-auto overflow-y-scroll p-6 pb-10 md:pb-6 w-full">
                {models.map((model) => (
                    <button
                        key={model.id}
                        type="button"
                        onClick={() => goToModel(model.id)}
                        className="flex flex-wrap flex-col bg-transparent hover:bg-gray-100 cursor-pointer gap-4 outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 p-6"
                        style={{ minWidth: '20rem' }}>
                        <span
                            aria-hidden={true}
                            className="bg-gray-200 bg-cover bg-center w-full h-60"
                            style={{
                                backgroundImage: `url(${model.image})`,
                            }}
                        />
                        <div>
                            <h2 className="font-mono text-base m-0 mb-1 text-left">
                                {model.id}
                            </h2>
                            <p className="m-0 text-left text-sm">
                                {model.description}
                            </p>
                        </div>
                    </button>
                ))}
                <div
                    className="flex flex-col bg-transparent p-6 gap-4"
                    style={{ minWidth: '20rem' }}>
                    <span
                        aria-hidden={true}
                        className="bg-gray-200 w-full h-60"
                    />
                    <div>
                        <h2 className="font-mono text-base m-0 mb-1 text-left">
                            {__('More models coming soon', 'stable-diffusion')}
                        </h2>
                        <p className="m-0 text-left text-base">
                            {__(
                                'Check back later for additional models',
                                'stable-diffusion',
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </ModalContainer>
    );
};

const ModalContainer = ({
    children,
    initialFocus,
}: {
    children: React.ReactNode;
    initialFocus?: React.RefObject<HTMLButtonElement>;
}) => {
    const { setShowSelectScreen, showSelectScreen } = useGlobalState();
    const onClose = () => setShowSelectScreen(false);

    return (
        <Dialog
            className="stable-diffusion-editor stable-diffusion-modal"
            data-cy="modal-switch"
            key="modal-switch"
            initialFocus={initialFocus}
            open={showSelectScreen}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
                <AnimatePresence>
                    <motion.div
                        key="switch-modal"
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className="sm:flex relative w-full shadow-2xl sm:overflow-hidden mx-auto bg-white max-w-screen-lg">
                        <Dialog.Title className="sr-only">
                            {__('Select a model', 'stable-diffusion')}
                        </Dialog.Title>
                        <div className="md:flex flex-col w-full relative">
                            <div className="flex items-center justify-between w-full border-b gap-x-4 bg-white h-10">
                                <div className="font-mono font-semibold text-sm px-6">
                                    {__('Select a model', 'stable-diffusion')}
                                </div>
                                <ModalCloseButton onClose={onClose} />
                            </div>
                            <div className="flex">{children}</div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};
