export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            marginTop: '2rem',
            flexWrap: 'wrap'
        }}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
            >
                Previous
            </button>
            
            {startPage > 1 && (
                <>
                    <button onClick={() => onPageChange(1)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        1
                    </button>
                    {startPage > 2 && <span style={{ padding: '0.5rem' }}>...</span>}
                </>
            )}
            
            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={currentPage === page ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '0.5rem 1rem' }}
                >
                    {page}
                </button>
            ))}
            
            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span style={{ padding: '0.5rem' }}>...</span>}
                    <button onClick={() => onPageChange(totalPages)} className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                        {totalPages}
                    </button>
                </>
            )}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary"
                style={{ padding: '0.5rem 1rem' }}
            >
                Next
            </button>
        </div>
    );
}