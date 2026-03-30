import React from "react";

const useStateWithLocalStorage = (localStorageKey: string, defaultValue = "") => {
    const [value, setValue] = React.useState(
        localStorage.getItem(localStorageKey) || defaultValue
    );

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, value);
    }, [value]);

    return [value, setValue] as const;
};

export default useStateWithLocalStorage;
