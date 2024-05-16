export const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

// Generic function to export files
export const exportFile = (content, fileName, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
// 2. Parse the CSV data
export const parseCSV = (csvData) => {
  const rows = csvData.split("\n");
  const headers = rows[0].split(",");

  return rows.slice(1).map((row) => {
    const values = row.split(",");
    return headers.reduce((object, header, index) => {
      object[header] = values[index];
      return object;
    }, {});
  });
};
