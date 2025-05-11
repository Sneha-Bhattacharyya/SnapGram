import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center w-full">
            <img
                src="/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
            />
        </div>
    );
};

export default Loader;