import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useInputsState } from '../state/inputs';
import { PromptInputs } from '../types';
import { ImageInput } from './inputs/ImageInput';
import { NumberSelect } from './inputs/NumberSelect';
import { PromptInput } from './inputs/PromptInput';

type Props = {
    promptInputData: PromptInputs;
    disabled: boolean;
};
export const InputGenerator = ({ promptInputData, disabled }: Props) => {
    const { width, height, prompt, numOutputs, setInput } = useInputsState();

    useEffect(() => {
        setInput('width', promptInputData?.width?.default ?? 512);
        setInput('height', promptInputData?.height?.default ?? 512);
        setInput('prompt', promptInputData?.prompt?.default ?? '');
    }, [promptInputData, setInput]);

    return (
        <div className="flex flex-col gap-y-4">
            {promptInputData?.prompt && (
                <PromptInput
                    value={prompt}
                    onChange={(v) => setInput('prompt', v)}
                    disabled={disabled}
                    label={__('Text prompt', 'stable-diffusion')}
                />
            )}
            {promptInputData?.initImage && (
                <div>
                    <p className="m-0 mb-2 text-base font-medium">
                        {__('Starting image', 'stable-diffusion')}
                    </p>
                    <div className="flex gap-2">
                        <ImageInput
                            onChange={(v) => setInput('initImage', v)}
                            disabled={disabled}
                        />
                    </div>
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
                {promptInputData?.width && (
                    <NumberSelect
                        label={__('Width', 'stable-diffusion')}
                        value={width}
                        disabled={disabled}
                        onChange={(v) => setInput('width', v)}
                        options={
                            promptInputData?.width?.enum ?? [
                                128, 256, 512, 768, 1024,
                            ]
                        }
                    />
                )}
                {promptInputData?.height && (
                    <NumberSelect
                        label={__('Height', 'stable-diffusion')}
                        value={height}
                        disabled={disabled}
                        onChange={(v) => setInput('height', v)}
                        options={
                            promptInputData?.height?.enum ?? [
                                128, 256, 512, 768, 1024,
                            ]
                        }
                    />
                )}
                {promptInputData?.numOutputs && (
                    <NumberSelect
                        label={__('Number of outputs', 'stable-diffusion')}
                        value={numOutputs}
                        disabled={disabled}
                        onChange={(v) => setInput('numOutputs', v)}
                        options={promptInputData?.numOutputs?.enum ?? [1]}
                    />
                )}
            </div>
        </div>
    );
};
