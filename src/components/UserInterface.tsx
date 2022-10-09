import apiFetch from '@wordpress/api-fetch';
import { Button } from '@wordpress/components';
import { Spinner } from '@wordpress/components';
import {
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from '@wordpress/element';
import { sprintf, __ } from '@wordpress/i18n';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useModel } from '../hooks/useModel';
import { usePrediction } from '../hooks/usePrediction';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { useInputsState } from '../state/inputs';
import { useSettingsStore } from '../state/settings';
import {
    AvailableModels,
    HeightInput,
    ImageLike,
    PromptInputs,
    WidthInput,
} from '../types';
import { InputGenerator } from './InputGenerator';
import { ModelCard } from './ModelCard';
import { GoButton } from './inputs/GoButton';
import { FocusHelperButton } from './misc/FocusHelperButton';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
    modelName: AvailableModels;
    initialFocus?: React.RefObject<HTMLButtonElement>;
};

type GenerateResponse = { id: string; error: string };

export const UserInferface = ({
    setImage,
    modelName,
    initialFocus,
}: StableDiffusionProps) => {
    const { data: modelInfo } = useModel(modelName);
    const { importingMessage, setMaybeImporting, maybeImporting } =
        useGlobalState();
    const { width, height, prompt } = useInputsState();
    const { has } = useSettingsStore();
    const { apiToken } = useAuthStore();
    const [errorMsg, setErrorMsg] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [promptInputData, setPromptInputData] = useState<PromptInputs>({});
    const importButtonRef = useRef<HTMLButtonElement>(null);
    const focusArea = useRef<HTMLFormElement>(null);
    const [generateId, setGenerateId] = useState<string>('');
    const { data: generateData } = usePrediction(generateId);

    const processing = ['starting', 'processing'].includes(
        generateData?.status ?? '',
    );
    const canImport = generateData?.status === 'succeeded' && !importingMessage;

    const focusFirstItem = () => {
        const selector = focusArea?.current?.querySelector(
            'input, textarea, select',
        ) as HTMLElement;
        selector?.focus();
    };

    const imageOutput = {
        maxWidth: `${width}px`,
        maxHeight: 'calc(100% - 2.5rem)',
        aspectRatio: `${width}/${height}`,
    };

    const handleSubmit = async () => {
        setErrorMsg('');
        setGenerateId('');
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
        setMaybeImporting(true);
        const response = await apiFetch<GenerateResponse>({
            path: `kevinbatdorf/stable-diffusion/generate?cache=${Date.now()}`,
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: {
                input: { width, height, prompt },
                version: modelInfo.latest_version.id,
                webhook_completed: has('optIns', 'prompt-share')
                    ? 'https://www.block-diffusion.com/api/v1/replicate'
                    : undefined,
            },
        }).catch((error) => {
            if (error.detail) {
                setMaybeImporting(false);
                setErrorMsg(error.detail);
            }
        });

        if (response?.error) {
            setMaybeImporting(false);
            setErrorMsg(response.error);
            return;
        }
        if (response?.id) setGenerateId(response.id);
    };

    const resetState = () => {
        setErrorMsg('');
        setGenerateId('');
    };

    const handleCancel = () =>
        apiFetch({
            path: 'kevinbatdorf/stable-diffusion/cancel',
            method: 'POST',
            headers: { Authorization: `Token ${apiToken}` },
            data: { id: generateId },
        });

    const handleImport = () => {
        if (!generateData?.output?.length) return;
        setImage({
            url: generateData.output[0],
            id: generateData?.id || generateId,
            caption: generateData?.input?.prompt || prompt,
        });
    };

    useEffect(() => {
        if (generateData?.error) setErrorMsg(generateData.error);
    }, [generateData?.error]);

    useEffect(() => {
        if (!processing || generateData?.status === 'failed') {
            setMaybeImporting(false);
        }
    }, [processing, setMaybeImporting, generateData?.status]);

    useEffect(() => {
        if (generateData?.status === 'succeeded') {
            importButtonRef.current?.focus();
        }
    }, [generateData?.status]);

    useEffect(() => {
        if (importingMessage) return;
        if (generateData?.metrics?.predict_time) {
            const time = sprintf(
                __('Billed time: %s', 'stable-diffusion'),
                generateData.metrics.predict_time,
            );
            setStatusMessage(time);
            return;
        }
        setStatusMessage(
            generateData?.status ? `${generateData?.status}...` : '',
        );
    }, [generateData, importingMessage]);

    useEffect(() => {
        if (importingMessage) setStatusMessage(importingMessage);
    }, [importingMessage]);

    useEffect(() => {
        const schema = modelInfo?.latest_version?.openapi_schema;
        if (!schema) return;
        const inputs = schema.components.schemas.Input.properties;
        // TODO: These could probably be more dynamic but lets do that when
        // the time comes to add support from a model
        const maybeWidth = inputs?.width
            ? schema.components.schemas.width
            : undefined;
        const maybeHeight = inputs?.height
            ? schema.components.schemas.height
            : undefined;
        setPromptInputData({
            prompt: inputs?.prompt,
            width: maybeWidth
                ? {
                      ...(maybeWidth as WidthInput),
                      default: inputs?.width?.default,
                  }
                : undefined,
            height: maybeHeight
                ? {
                      ...(maybeHeight as HeightInput),
                      default: inputs?.height?.default,
                  }
                : undefined,
        });
    }, [modelInfo]);

    useLayoutEffect(() => {
        resetState();
    }, [promptInputData, width, height]);

    useEffect(() => {
        focusFirstItem();
    }, [promptInputData]);

    if (!modelInfo) {
        return (
            <div className="flex items-center justify-center w-full">
                <FocusHelperButton initialFocus={initialFocus} />
                <Spinner />
            </div>
        );
    }

    if (!Object.keys(promptInputData).length) {
        return (
            <div className="flex items-center justify-center w-full">
                {__(
                    'Model version not found. Please open a support ticket.',
                    'stable-diffusion',
                )}
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col justify-between md:w-96 flex-shrink-0 overflow-y-scroll bg-white">
                <form
                    ref={focusArea}
                    className="flex flex-col justify-between gap-y-4 flex-shrink-0 p-6 pb-0 flex-grow"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}>
                    {promptInputData && (
                        <InputGenerator
                            promptInputData={promptInputData}
                            disabled={processing}
                        />
                    )}
                    <div>
                        <AnimatePresence>
                            <GoButton
                                disabled={maybeImporting}
                                importing={importingMessage.length > 0}
                                processing={processing}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                            />
                        </AnimatePresence>
                        <p
                            className="text-red-500 m-0 my-2"
                            style={{ minHeight: '20px' }}>
                            {errorMsg}
                        </p>
                    </div>
                </form>
                <AnimatePresence>
                    <ModelCard modelInfo={modelInfo} />
                </AnimatePresence>
            </div>
            <div className="w-full h-full overflow-hidden p-8 bg-gray-50">
                <AnimatePresence>
                    <div className="mb-2 -mt-4 h-10 w-full">
                        {statusMessage && (
                            <motion.div
                                className={classNames(
                                    'h-full flex items-center',
                                    {
                                        'justify-between': canImport,
                                        'justify-center': !canImport,
                                    },
                                )}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}>
                                <motion.span
                                    className="font-mono"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}>
                                    {statusMessage}
                                </motion.span>
                                {canImport && (
                                    <Button
                                        ref={importButtonRef}
                                        onClick={handleImport}
                                        type="button"
                                        variant="primary">
                                        {__(
                                            'Import into editor',
                                            'stable-diffusion',
                                        )}
                                    </Button>
                                )}
                            </motion.div>
                        )}
                    </div>
                </AnimatePresence>
                <motion.div
                    role="button"
                    onClick={focusFirstItem}
                    transition={{ type: 'Tween' }}
                    className="border border-gray-500 flex items-center justify-center bg-cover mx-auto"
                    style={{
                        backgroundImage: generateData?.output?.length
                            ? `url(${generateData?.output?.[0]})`
                            : undefined,
                    }}
                    animate={imageOutput}
                    initial={imageOutput}
                />
            </div>
        </>
    );
};
