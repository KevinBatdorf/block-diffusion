import { AnimatePresence, motion } from 'framer-motion';
import { useInputsState } from '../../state/inputs';

export const SimplePanel = () => {
    const { width, height } = useInputsState();
    const imageOutput = {
        maxWidth: `${width}px`,
        maxHeight: 'calc(100% - 2.5rem)',
        aspectRatio: `${width}/${height}`,
    };
    return (
        <AnimatePresence>
            <motion.div
                key="canvas-placeholder"
                role="button"
                transition={{ type: 'Tween' }}
                className="border border-gray-500 flex items-center justify-center bg-cover m-auto"
                animate={imageOutput}
                initial={imageOutput}>
                <div className="w-screen" />
            </motion.div>
        </AnimatePresence>
    );
};
