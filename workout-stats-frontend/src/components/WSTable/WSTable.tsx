import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

/**
 * This is a UX component styling a table.
 * It's a thin layer on top of react-super-responsive-table and tailwind.
 */
export function WSTable(props: WSTableProps) {
  let tableClass = "min-w-full text-left text-sm font-light";
  if (props.fixed) tableClass += " table-fixed";

  let theadClass = "border-b font-medium dark:border-neutral-500 bg-blue-400";
  let thClass = "px-6 py-4";
  if (props.lightHeader) {
    theadClass = "border-b font-medium dark:border-neutral-500 bg-transparent";
    thClass = "px-3 py-4 text-gray-400 font-normal";
  }
  return (
    <Table className={tableClass}>
      <Thead className={theadClass}>
        <Tr>
          {props.headers.map((h, i) => (
            <Th key={`${h}-${i}`} className={thClass}>
              {h}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {props.data.map((d, i) => (
          <Tr
            key={i}
            className="border-b dark:border-neutral-500 odd:bg-slate-50"
          >
            {d.map((c, j) => (
              <Td key={j} className="whitespace-nowrap px-6 py-4">
                {c}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

type WSTableProps = {
  headers: (number | string)[];
  data: (number | string | boolean)[][];
  fixed?: boolean;
  lightHeader?: boolean;
};
