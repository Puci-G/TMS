export default function Table({ cols, rows }) {
  return (
    <table className="table">
      <thead><tr>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
      <tbody>{rows.length ? rows.map((r,i) => <tr key={i}>{r}</tr>)
                           : <tr><td colSpan={cols.length}>No data</td></tr>}</tbody>
    </table>
  );
}
