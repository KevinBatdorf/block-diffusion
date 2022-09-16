import classNames from 'classnames';
import { makeUrlFriendly } from '../../lib/utils';

type PromptSelectProps = {
    value: string;
    label: string;
    disabled: boolean;
    initialFocus?: React.RefObject<HTMLTextAreaElement>;
    onChange: (value: string) => void;
};
export const PromptInput = ({
    value,
    label,
    disabled,
    initialFocus,
    onChange,
}: PromptSelectProps) => {
    const formItemClass = classNames('w-full text-lg ringed border', {
        'bg-gray-200 border-gray-200': disabled,
        'border-gray-900': !disabled,
    });
    const id = `replicate-prompt-${makeUrlFriendly(label)}`;
    return (
        <div>
            <label htmlFor={id} className="text-lg font-medium block mb-1">
                {label}
            </label>
            <textarea
                ref={initialFocus}
                className={formItemClass}
                id={id}
                value={value}
                rows={4}
                disabled={disabled}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};
