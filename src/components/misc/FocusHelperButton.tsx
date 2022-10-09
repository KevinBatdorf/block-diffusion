/* This is so we can manage focus outside of headless ui */
export const FocusHelperButton = ({
    initialFocus,
}: {
    initialFocus?: React.RefObject<HTMLButtonElement>;
}) => (
    <button
        ref={initialFocus}
        aria-hidden={true}
        type="button"
        className="fixed top-0 w-px h-0 p-0 -m-px overflow-hidden whitespace-nowrap border-0 outline-none shadow-none"
        style={{ clip: 'rect(0px, 0px, 0px, 0px)' }}
    />
);
