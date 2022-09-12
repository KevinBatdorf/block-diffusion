import apiFetch from '@wordpress/api-fetch';
import { Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useModel } from '../hooks/useModel';
import { usePrediction } from '../hooks/usePrediction';
import { useAuthStore } from '../state/auth';
import { ImageLike, ModelData } from '../types';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
    initialFocus: React.RefObject<HTMLTextAreaElement>;
};

type GenerateResponse = { id: string; error: string };

export const StableDiffusion = ({
    setImage,
    initialFocus,
}: StableDiffusionProps) => {
    const { data: modelInfo } = useModel('stability-ai/stable-diffusion');
    const { apiToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState('');
    const [prompt, setPrompt] = useState('');
    const [width, setWidth] = useState('512');
    const [height, setHeight] = useState('512');
    const hwvalues = [128, 256, 512, 768, 1024];
    const [generateId, setGenerateId] = useState<string>(
        '3s3oeclvsbaqffwppp7xpaehtu',
    );
    const { data: generateData } = usePrediction(generateId);

    const handleSubmit = async () => {
        setErrorMsg('');
        if (!prompt) {
            setErrorMsg(__('Please enter a prompt', 'stable-diffusion'));
            return;
        }
        if (!modelInfo?.latest_version?.id) {
            setErrorMsg(
                __(
                    'Model version not found. Please open a support ticket.',
                    'stable-diffusion',
                ),
            );
            return;
        }
        const response = await apiFetch<GenerateResponse>({
            path: 'kevinbatdorf/stable-diffusion/generate',
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: {
                input: { width, height, prompt },
                version: modelInfo.latest_version.id,
            },
        }).catch((error) => {
            if (error.detail) {
                setErrorMsg(error.detail);
            }
        });
        if (response?.error) {
            setErrorMsg(response.error);
            return;
        }
        if (response?.id) setGenerateId(response.id);
    };

    const handleCancel = () =>
        apiFetch({
            path: 'kevinbatdorf/stable-diffusion/cancel',
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: { id: generateId },
        });

    const handleReset = () => {
        setPrompt('');
        setWidth('512');
        setHeight('512');
        setErrorMsg('');
        setGenerateId('');
    };

    return (
        <>
            <div className="flex flex-col justify-between md:w-96 flex-shrink-0">
                <form
                    className="flex flex-col gap-y-4 flex-shrink-0 p-8 flex-grow"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    <div>
                        <label
                            htmlFor="replicate-prompt"
                            className="text-lg font-medium block mb-1">
                            {__('Prompt', 'stable-diffusion')}
                        </label>
                        <textarea
                            ref={initialFocus}
                            className={classNames(
                                'w-full text-lg ringed border',
                                {
                                    'bg-gray-200 border-gray-200': !!generateId,
                                },
                            )}
                            id="replicate-prompt"
                            value={prompt}
                            rows={4}
                            disabled={!!generateId}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="replicate-width"
                            className="text-lg font-medium block mb-1">
                            {__('Width', 'stable-diffusion')}
                        </label>
                        <select
                            id="replicate-width"
                            className={classNames(
                                'w-full text-lg ringed border',
                                {
                                    'bg-gray-200 border-gray-200': !!generateId,
                                },
                            )}
                            disabled={!!generateId}
                            onChange={(e) => setWidth(e.target.value)}
                            value={width}>
                            {hwvalues.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label
                            htmlFor="replicate-height"
                            className="text-lg font-medium block mb-1">
                            {__('Height', 'stable-diffusion')}
                        </label>
                        <select
                            id="replicate-height"
                            className={classNames(
                                'w-full text-lg ringed border',
                                {
                                    'bg-gray-200 border-gray-200': !!generateId,
                                },
                            )}
                            disabled={!!generateId}
                            onChange={(e) => setHeight(e.target.value)}
                            value={height}>
                            {hwvalues.map((value) => (
                                <option key={value} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end mt-4 gap-x-2">
                        <AnimatePresence>
                            <GoButton
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                onReset={handleReset}
                                status={generateData?.status}
                            />
                        </AnimatePresence>
                    </div>
                    <p
                        className="text-red-500 m-0"
                        style={{ minHeight: '20px' }}>
                        {errorMsg}
                    </p>
                </form>
                <AnimatePresence>
                    <div
                        className="flex items-end"
                        style={{ minHeight: '250px' }}>
                        {modelInfo && (
                            <motion.div
                                className="p-8 pt-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}>
                                <ModelMetadata {...modelInfo} />
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
            </div>
            <div className="w-full h-full overflow-hidden p-8">
                <AnimatePresence>
                    <div
                        className="mb-2 -mt-4 h-10"
                        style={{ maxWidth: `${width}px` }}>
                        {generateData?.metrics?.predict_time ? (
                            <motion.div
                                className="h-full flex items-end justify-between"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}>
                                <span className="font-mono">
                                    {sprintf(
                                        __(
                                            'Billed time: %s',
                                            'stable-diffusion',
                                        ),
                                        generateData.metrics.predict_time,
                                    )}
                                </span>
                                {generateData?.status === 'succeeded' && (
                                    <Button
                                        ref={(
                                            item: HTMLButtonElement | null,
                                        ) => {
                                            item?.focus();
                                        }}
                                        type="button"
                                        variant="primary">
                                        {__(
                                            'Import into editor',
                                            'stable-diffusion',
                                        )}
                                    </Button>
                                )}
                            </motion.div>
                        ) : (
                            generateData?.status && (
                                <motion.div
                                    className="h-full font-mono flex items-end"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}>
                                    {generateData?.status}
                                </motion.div>
                            )
                        )}
                    </div>
                </AnimatePresence>
                <div
                    className="bg-gray-100 flex items-center justify-center"
                    style={{
                        maxWidth: `${width}px`,
                        maxHeight: '100%',
                        aspectRatio: `${width}/${height}`,
                        backgroundImage: generateData?.output
                            ? `url(${generateData?.output?.[0]})`
                            : undefined,
                    }}
                />
            </div>
        </>
    );
};

const GoButton = ({
    status,
    onSubmit,
    onReset,
    onCancel,
}: {
    status?: string;
    onSubmit: () => void;
    onReset: () => void;
    onCancel: () => void;
}) => {
    if (!status) {
        return (
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <Button onClick={onSubmit} variant="primary">
                    {__('Submit', 'stable-diffusion')}
                </Button>
            </motion.span>
        );
    }
    if (['starting', 'processing'].includes(status)) {
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
            <Button onClick={onReset} variant="primary">
                {__('Reset', 'stable-diffusion')}
            </Button>
        </motion.span>
    );
};

const ModelMetadata = ({
    url,
    description,
    name,
    owner,
    paper_url,
    license_url,
    github_url,
}: ModelData) => (
    <div className="bg-gray-100 p-4">
        {(owner || name) && (
            <div className="font-medium font-mono mb-2">
                {owner} / {name}
            </div>
        )}
        {description && <p className="m-0 mb-6 leading-tight">{description}</p>}

        {(url || paper_url || license_url || github_url) && (
            <div>
                <div className="flex gap-x-2">
                    {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {__('Model', 'stable-diffusion')}
                        </a>
                    )}
                    {paper_url && (
                        <a
                            href={paper_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('Paper', 'stable-diffusion')}
                        </a>
                    )}
                    {license_url && (
                        <a
                            href={license_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('License', 'stable-diffusion')}
                        </a>
                    )}
                    {github_url && (
                        <a
                            href={github_url}
                            target="_blank"
                            rel="noopener noreferrer">
                            {__('GitHub', 'stable-diffusion')}
                        </a>
                    )}
                </div>
                <p className="text-xs italic m-0 mt-2">
                    {__('Links open in a new tab', 'stable-diffusion')}
                </p>
            </div>
        )}
    </div>
);
