type ImageInputProps = {
    disabled: boolean;
    initialFocus?: React.RefObject<HTMLTextAreaElement>;
    onChange: (value: string) => void;
};
export const ImageInput = ({ disabled, onChange }: ImageInputProps) => {
    return (
        <div>
            <input
                type="file"
                accept="image/*"
                disabled={disabled}
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        const fileReader = new FileReader();
                        fileReader.readAsDataURL(file);
                        fileReader.onload = () => {
                            onChange(fileReader.result as string);
                        };
                    }
                }}
            />
        </div>
    );
};
