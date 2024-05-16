import { exportFile } from "./file.js";

export const parseCSV = (csvData) => {
  const rows = csvData.trim().split("\n"); // Trim to remove trailing newlines
  const headers = rows[0].split(",");

  return rows
    .slice(1)
    .map((row) => {
      const values = row.split(",");
      return headers.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
    })
    .filter((row) => Object.values(row).some((value) => value)); // Filter out empty rows
};

// Function to get field names from the data
export const getFields = (data) => {
  return data.length > 0 ? Object.keys(data[0]) : [];
};

// 3. Remove columns
export const removeColumns = (data, columnsToRemove) => {
  return data.map((row) => {
    columnsToRemove.forEach((column) => delete row[column]);
    return row;
  });
};
// Function to convert data to CSV
export const convertToCSV = (data) => {
  if (data.length === 0) return "";

  // Extract headers
  const headers = Object.keys(data[0]);

  // Convert each object to a CSV row
  const rows = data.map((obj) =>
    headers.map((header) => JSON.stringify(obj[header] ?? "")).join(","),
  );

  // Combine headers and rows
  return [headers.join(","), ...rows].join("\n");
};

// Updated exportCSV to use exportFile
export const exportCSV = (data) => {
  const csvString = convertToCSV(data);
  exportFile(csvString, "exported-data.csv", "text/csv");
};

export const transformCsvData = (csvData, fieldMapping) => {
  return csvData.map((row) => mapRowToModel(row, fieldMapping));
};
const mapRowToModel = (row, fieldMapping) => {
  return Object.keys(fieldMapping).reduce((acc, modelField) => {
    const csvField = fieldMapping[modelField];
    acc[modelField] = row[csvField];
    return acc;
  }, {});
};
