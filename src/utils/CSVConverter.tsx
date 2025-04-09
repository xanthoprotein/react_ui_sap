export const convertToCSV = (data: any[]) => {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) =>
        row[header] === null || row[header] === undefined ? "" : row[header]
      )
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};
