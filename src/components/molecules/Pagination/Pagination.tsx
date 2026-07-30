import "./Pagination.css";

type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
};

function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className={`pagination${className ? ` ${className}` : ""}`}>
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    className={p === page ? "active" : ""}
                    onClick={() => onPageChange(p)}
                >
                    {p}
                </button>
            ))}

            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                Next
            </button>
        </div>
    );
}

export default Pagination;