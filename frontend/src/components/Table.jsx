import { Children, cloneElement, isValidElement } from 'react'

function Table({ columns = [], rows = [], renderRow }) {
  function renderResponsiveRow(row) {
    const renderedRow = renderRow(row)

    if (!isValidElement(renderedRow)) {
      return renderedRow
    }

    const cells = Children.map(renderedRow.props.children, (cell, index) => {
      if (!isValidElement(cell)) {
        return cell
      }

      return cloneElement(cell, {
        'data-label': columns[index],
        className: `${cell.props.className || ''} max-sm:flex max-sm:items-start max-sm:justify-between max-sm:gap-4 max-sm:px-4 max-sm:py-3 max-sm:text-right max-sm:before:content-[attr(data-label)] max-sm:before:text-left max-sm:before:text-xs max-sm:before:font-semibold max-sm:before:uppercase max-sm:before:tracking-wide max-sm:before:text-slate-500`,
      })
    })

    return cloneElement(renderedRow, {
      className: `${renderedRow.props.className || ''} max-sm:block max-sm:border-b max-sm:border-slate-200 max-sm:p-2`,
      children: cells,
    })
  }

  return (
    <div className="max-w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm max-sm:block">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 max-sm:hidden">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 max-sm:block max-sm:divide-y-0">
            {rows.map((row) => renderResponsiveRow(row))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Table
