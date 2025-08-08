// File: resources/js/Components/Table.jsx

// Komponen untuk Header Tabel (thead)
const TableHeader = ({ children }) => {
    // Style header sesuai permintaan: warna latar #25335C dan teks putih
    return (
        <thead className="text-xs text-white uppercase" style={{ backgroundColor: '#25335C' }}>
            <tr>{children}</tr>
        </thead>
    );
};

// Komponen untuk setiap sel header (th)
const TableHead = ({ children, className = '' }) => {
    return (
        <th className={`px-4 py-3 text-nowrap ${className}`}>
            {children}
        </th>
    );
};

// Komponen untuk Body Tabel (tbody)
const TableBody = ({ children }) => {
    return <tbody>{children}</tbody>;
};

// Komponen untuk setiap baris (tr)
const TableRow = ({ children, className = '' }) => {
    return (
        <tr className={`bg-white border-b hover:bg-gray-50 ${className}`}>
            {children}
        </tr>
    );
};

// Komponen untuk setiap sel data (td)
const TableData = ({ children, className = '' }) => {
    return (
        <td className={`px-4 py-2 align-middle ${className}`}>
            {children}
        </td>
    );
};

// Komponen utama Tabel
const Table = ({ children, className = '' }) => {
    return (
        <div className="overflow-auto">
            <table className={`w-full text-sm text-left rtl:text-right text-gray-500 ${className}`}>
                {children}
            </table>
        </div>
    );
};

// "Menempelkan" sub-komponen ke komponen utama agar mudah diimpor
Table.Header = TableHeader;
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Data = TableData;

export default Table;