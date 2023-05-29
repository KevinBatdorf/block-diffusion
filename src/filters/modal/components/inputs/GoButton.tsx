import { __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { motion } from 'framer-motion';

type GoButtonProps = {
    processing: boolean;
    disabled: boolean;
    importing: boolean;
    onSubmit: () => void;
    onCancel: () => void;
};
export const GoButton = ({
    processing,
    onSubmit,
    onCancel,
    importing,
    disabled,
}: GoButtonProps) => {
    const clx = classNames(
        'w-full p-4 cursor-pointer outline-none focus:shadow-none focus:ring-wp focus:ring-wp-theme-500 transition-all duration-200',
        {
            'bg-gray-900 text-white hover:bg-wp-theme-500': !disabled,
            'bg-gray-200 text-gray-900': disabled && !processing,
            'bg-wp-alert-red text-white': processing,
        },
    );
    if (importing)
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <button
                    className={clx}
                    type="submit"
                    onClick={() => undefined}
                    disabled>
                    {__('Importing...', 'stable-diffusion')}
                </button>
            </motion.span>
        );
    if (processing) {
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <button className={clx} type="submit" onClick={onCancel}>
                    {__('Cancel run', 'stable-diffusion')}
                </button>
            </motion.span>
        );
    }
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <button
                className={clx}
                type="submit"
                onClick={onSubmit}
                disabled={disabled}>
                {__('Run model', 'stable-diffusion')}
            </button>
        </motion.span>
    );
};
