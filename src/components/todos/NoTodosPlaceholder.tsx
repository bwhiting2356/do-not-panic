export function NoTodosPlaceholder() {
  return (
    <tr>
      <td
        colSpan={8}
        style={{
          textAlign: "center",
          justifyContent: "center",
          height: "200px",
          padding: "20px",
          backgroundColor: "#ebedeb",
          fontSize: "20px",
        }}
      >
        No todos here
      </td>
    </tr>
  );
}
