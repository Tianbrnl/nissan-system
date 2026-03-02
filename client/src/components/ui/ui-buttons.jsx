export function ConfirmButton({ children, onClick = () => { } }) {
    return (
        <button
            className="btn bg-nissan-red text-white rounded-xl"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function CancelButton({ children, onClick = () => { } }) {
    return (
        <button
            className="btn btn-ghost rounded-xl"
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export function LinkButton({ children, onClick = () => { } }) {
    return (
        <button
            className="text-nissan-red font-semibold w-fit mx-auto cursor-pointer"
            onClick={onClick}
        >
            {children}
        </button>
    )
}