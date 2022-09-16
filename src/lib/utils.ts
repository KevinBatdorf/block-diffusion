export const makeUrlFriendly = (str: string) => {
    return str
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9]/g, '-');
};
