import { useState } from "react";

const Popup = ({ isOpen, onClose, title, children }) => {
    console.log(isOpen);
    const [isClosed, setIsClosed] = useState(false);

    // 点击关闭按钮
    const handleClose = () => {
        setIsClosed(true);
        onClose();
    };

    return (
        <>
            {console.log(isOpen && !isClosed)}
            {isOpen && !isClosed && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-4 mx-4 md:mx-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-medium">{title}</h2>
                            <button
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                onClick={handleClose}
                            >
                                <svg
                                    className="h-6 w-6 fill-current"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <title>Close</title>
                                    <path
                                        d="M14.348 14.849a1.5 1.5 0 11-2.121 2.122L10 12.12l-2.828 2.85a1.5 1.5 0 11-2.12-2.122L7.88 10l-2.849-2.828a1.5 1.5 0 112.122-2.121L10 7.88l2.828-2.849a1.5 1.5 0 112.12 2.122L12.12 10l2.849 2.828z"
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div>{children}</div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Popup;
