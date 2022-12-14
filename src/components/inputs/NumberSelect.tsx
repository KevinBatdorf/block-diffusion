import classNames from 'classnames';
import { makeUrlFriendly } from '../../utils';

type NumberSelectProps = {
    options: number[];
    value: number;
    label: string;
    disabled: boolean;
    initialFocus?: React.RefObject<HTMLTextAreaElement>;
    onChange: (value: number) => void;
};
export const NumberSelect = ({
    options,
    label,
    disabled,
    value,
    onChange,
}: NumberSelectProps) => {
    const formItemClass = classNames(
        'w-full text-base rounded-none focus:outline-none focus:ring-wp ring-offset-1 ring-wp-theme-500 focus:shadow-none border',
        {
            'bg-gray-200 border-gray-200': disabled,
            'border-gray-900': !disabled,
        },
    );
    const id = `replicate-input-${makeUrlFriendly(label)}`;
    return (
        <div className="w-full">
            <label htmlFor={id} className="text-base font-medium block mb-1">
                {label}
            </label>
            <select
                id={id}
                className={formItemClass}
                disabled={disabled}
                onChange={(e) => onChange(Number(e.target.value))}
                value={value}>
                {options.map((value) => (
                    <option key={value} value={value}>
                        {value}
                    </option>
                ))}
            </select>
        </div>
    );
};
