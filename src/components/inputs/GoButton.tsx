import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
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
    if (importing)
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <Button onClick={() => undefined} disabled variant="primary">
                    {__('Importing...', 'stable-diffusion')}
                </Button>
            </motion.span>
        );
    if (processing) {
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <Button onClick={onCancel} variant="primary" isDestructive>
                    {__('Cancel run', 'stable-diffusion')}
                </Button>
            </motion.span>
        );
    }
    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            <Button onClick={onSubmit} variant="primary" disabled={disabled}>
                {__('Submit', 'stable-diffusion')}
            </Button>
        </motion.span>
    );
};
