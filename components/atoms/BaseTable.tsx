import { Table as MantineTable } from "@mantine/core";
import { flexRender, Table } from "@tanstack/react-table";

interface Props<T> {
  table: Table<T>;
}

const BaseTable = <T,>({ table }: Props<T>) => {
  return (
    <MantineTable>
      {/* TABLE HEAD */}
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      {/* TABLE BODY */}
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MantineTable>
  );
};

export default BaseTable;
