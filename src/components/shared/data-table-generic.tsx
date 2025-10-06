"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableSkeleton } from "@/components/ui/table-skeleton";

interface Column<T> {
  header: string;
  accessor: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableGenericProps<T> {
  data: T[] | undefined;
  columns: Column<T>[];
  isLoading: boolean;
  keyExtractor: (item: T) => string;
}

export function DataTableGeneric<T>({ data, columns, isLoading, keyExtractor }: DataTableGenericProps<T>) {
  if (isLoading) return <TableSkeleton columns={columns.length} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, idx) => (
            <TableHead key={idx} className={col.className}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item) => (
          <TableRow key={keyExtractor(item)}>
            {columns.map((col, idx) => (
              <TableCell key={idx} className={col.className}>{col.accessor(item)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
