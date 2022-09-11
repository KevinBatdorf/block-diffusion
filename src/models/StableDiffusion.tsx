import { SelectControl } from '@wordpress/components';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { useAuth } from '../hooks/useAuth';
import { useModel } from '../hooks/useModel';
import { useAuthStore } from '../state/auth';
import { useGlobalState } from '../state/global';
import { ImageLike } from '../types';

type StableDiffusionProps = {
    setImage: (image: ImageLike) => void;
    initialFocus: React.RefObject<HTMLTextAreaElement>;
};

export const StableDiffusion = ({
    setImage,
    initialFocus,
}: StableDiffusionProps) => {
    const gridRef = useRef<HTMLDivElement>(null);
    const { data, loading, error } = useModel('stability-ai/stable-diffusion');
    const [prompt, setPrompt] = useState('');
    const [width, setWidth] = useState('512');
    const [height, setHeight] = useState('512');
    const hwvalues = [128, 256, 512, 768, 1024];

    return (
        <div
            ref={gridRef}
            className="w-full relative h-full overflow-y-scroll p-6 flex gap-x-16">
            <form
                className="flex flex-col lg:w-96 gap-y-4 flex-shrink-0"
                onSubmit={(e) => {
                    e.preventDefault();
                }}>
                <div>
                    <label
                        htmlFor="replicate-prompt"
                        className="text-lg font-medium block mb-1">
                        {__('Prompt', 'stable-diffusion')}
                    </label>
                    <textarea
                        ref={initialFocus}
                        id="replicate-prompt"
                        value={prompt}
                        rows={4}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full text-lg ringed"
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
                        className="w-full text-lg ringed"
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
                        {__('Width', 'stable-diffusion')}
                    </label>
                    <select
                        id="replicate-height"
                        className="w-full text-lg ringed"
                        onChange={(e) => setHeight(e.target.value)}
                        value={height}>
                        {hwvalues.map((value) => (
                            <option key={value} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
            <div className="w-full overflow-hidden overflow-y-scroll">
                <div
                    className="bg-gray-100"
                    style={{
                        width: `${width}px`,
                        maxWidth: '100%',
                        aspectRatio: `${width}/${height}`,
                    }}>
                    inner
                </div>
            </div>
        </div>
    );
};
