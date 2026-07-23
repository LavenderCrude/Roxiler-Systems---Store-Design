import Button from './Button';

export default function DataTable({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  onRowClick,
  emptyMessage = 'No records found',
}) {
  const handleSort = (key) => {
    if (!onSort || !key) return;
    const newOrder = sortBy === key && sortOrder === 'ASC' ? 'DESC' : 'ASC';
    onSort(key, newOrder);
  };

  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'sortable' : ''}
                onClick={() => col.sortable && handleSort(col.key)}
              >
                {col.label}
                {col.sortable && sortBy === col.key && (
                  <span className="sort-indicator">{sortOrder === 'ASC' ? ' ▲' : ' ▼'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id || row.user_id || JSON.stringify(row)}
                className={onRowClick ? 'clickable-row' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="pagination-info">Page {page} of {totalPages}</span>
      <Button
        variant="secondary"
        size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
