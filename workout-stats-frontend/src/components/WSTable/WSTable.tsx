import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

/**
 * This is a UX component styling a table.
 * It's a thin layer on top of react-super-responsive-table and tailwind.
 */
export function WSTable(props: WSTableProps) {

    return <Table className="min-w-full text-left text-sm font-light">
        <Thead className="border-b font-medium dark:border-neutral-500 bg-blue-400">
            <Tr>
                {props.headers.map((h, i) => <Th key={`${h}-${i}`} className="px-6 py-4">{h}</Th>)}
            </Tr>
        </Thead>
        <Tbody>
            {props.data.map((d, i) => <Tr key={i} className="border-b dark:border-neutral-500 even:bg-slate-50">
                {d.map((c, j) => <Td key={j} className="whitespace-nowrap px-6 py-4">{c}</Td>)}
            </Tr>)}
        </Tbody>
    </Table>

}

type WSTableProps = {
    headers: (number | string)[],
    data: (number | string | boolean)[][]
}