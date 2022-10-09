import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useInputsState } from '../state/inputs';
import { PromptInputs } from '../types';
import { NumberSelect } from './inputs/NumberSelect';
import { PromptInput } from './inputs/PromptInput';

type Props = {
    promptInputData: PromptInputs;
    disabled: boolean;
};
export const InputGenerator = ({ promptInputData, disabled }: Props) => {
    const { width, height, prompt, setInput } = useInputsState();

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
            <div className="flex gap-x-4">
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
            </div>
        </div>
    );
};