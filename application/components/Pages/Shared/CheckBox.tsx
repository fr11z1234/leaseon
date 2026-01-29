import React from 'react';

type CheckboxProps = {
    modelValue: boolean;
    label: string;
    onUpdateModelValue: (value: boolean) => void;
};

const Checkbox = ({ modelValue, label, onUpdateModelValue }: CheckboxProps) => {
    const updateValue = () => {
        onUpdateModelValue(!modelValue);
    };

    return (
        <div className="flex items-center gap-2.5 cursor-pointer group" onClick={updateValue}>
            <div
                className={`flex justify-center items-center rounded p-0 w-5 h-5 border !border-gray-300 bg-transparent group-hover:bg-primary-faded group-hover:!border-dark-faded transition ${modelValue ? '!bg-blue-600 group-hover:!bg-blue-600' : ''
                    }`}
            >
                <svg
                    className={`opacity-0 transition ${modelValue ? '!opacity-100' : ''}`}
                    width="9"
                    height="8"
                    viewBox="0 0 9 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M8.57781 0.246564C9.02566 0.604843 9.12713 1.23563 8.83482 1.71215L8.75351 1.82782L4.25351 7.45282C3.83853 7.97154 3.07698 8.01346 2.60683 7.5722L2.51078 7.47025L0.260779 4.77025C-0.13698 4.29294 -0.0724908 3.58355 0.404821 3.18579C0.845416 2.81863 1.48375 2.84534 1.8922 3.22704L1.98928 3.32983L3.35815 4.97029L6.99655 0.422259C7.35483 -0.0255894 7.98562 -0.127065 8.46214 0.165253L8.57781 0.246564Z"
                        fill="white"
                    />
                </svg>
            </div>
            <p className="text-slate-900 text-text">{label}</p>
        </div>
    );
};

export default Checkbox;