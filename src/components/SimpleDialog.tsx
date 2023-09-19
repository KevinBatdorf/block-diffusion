import { Dialog } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { ModalCloseButton } from './ModalControls';

type ModalProps = {
    onClose: () => void;
    title: string;
    open: boolean;
    disablePadding?: boolean;
    testingId?: string;
    maxHeight?: number;
    maxWClass?: string;
    children: React.ReactNode;
    initialFocus: React.RefObject<HTMLElement>;
};
export const SimpleDialog = ({
    title,
    onClose,
    open,
    disablePadding,
    testingId,
    maxHeight,
    initialFocus,
    maxWClass = 'max-w-screen-sm',
    children,
}: ModalProps) => {
    return (
        <Dialog
            className="block-diffusion-editor stable-diffusion-modal"
            initialFocus={initialFocus}
            data-cy={testingId}
            open={open}
            onClose={onClose}>
            <div className="absolute mx-auto w-full h-full overflow-hidden md:p-8 md:flex justify-center items-center z-high">
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    aria-hidden="true"
                />
                <AnimatePresence>
                    <motion.div
                        key={`modal-${title}`}
                        initial={{ y: 5 }}
                        animate={{ y: 0 }}
                        exit={{ y: 0, opacity: 0 }}
                        className={classNames(
                            'sm:flex relative shadow-2xl mx-auto bg-white overflow-y-auto md:overflow-hidden h-screen md:h-auto flex-grow',
                            {
                                [maxWClass]: maxWClass,
                            },
                        )}>
                        <Dialog.Title className="sr-only">{title}</Dialog.Title>
                        <div className="w-full relative">
                            <div className="flex flex-col md:overflow-x-hidden flex-grow">
                                <div className="flex items-center justify-between w-full border-b gap-x-4 bg-white h-10">
                                    <div className="font-mono font-semibold text-sm px-6">
                                        {title}
                                    </div>
                                    <ModalCloseButton onClose={onClose} />
                                </div>
                                <div
                                    style={{ maxHeight }}
                                    className={classNames(
                                        'flex flex-grow w-screen max-w-full flex-col space-y-4 bg-gray-50 overflow-auto',
                                        {
                                            'p-6': !disablePadding,
                                        },
                                    )}>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </Dialog>
    );
};
