const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const port = 3000;
app.use(cors()); // Allow requests from all origins
app.use(bodyParser.json());

app.post('/save', (req, res) => {
  const { link, comment, supportingLink, tag, filename } = req.body;
// Default filename if not provided
  const filePath = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
  
  try {
    // Load existing workbook or create a new one
    let workbook;
    if (fs.existsSync(filePath)) {
      console.log("Loading existing workbook");
      workbook = XLSX.readFile(filePath);
    } else {
      console.log("Creating new workbook");
      workbook = XLSX.utils.book_new();
    }

    // Load existing sheet or create a new one
    let worksheet;
    if (workbook.SheetNames.length > 0) {
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
    } else {
      console.log("Creating new sheet");
      worksheet = XLSX.utils.aoa_to_sheet([['Link', 'Comment', 'Supporting Link', 'Tag']]);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Links');
    }


  // Append new data
  const newRow = [link, comment, supportingLink, tag];
  XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });

  // Get the range and determine the last row
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  const lastRow = range.e.r; // Get the last row number
  console.log(`Last row number: ${lastRow}`);

  // Set hyperlink and style for the main link
  const linkCellRef = XLSX.utils.encode_cell({ r: lastRow, c: 0 });
  worksheet[linkCellRef].l = { Target: link, Tooltip: link };
  worksheet[linkCellRef].s = { font: { color: { rgb: "0000FF" }, underline: true } };

  // Set hyperlink and style for the supporting link if provided
  if (supportingLink) {
    const supportingLinkCellRef = XLSX.utils.encode_cell({ r: lastRow, c: 2 });
    worksheet[supportingLinkCellRef].l = { Target: supportingLink, Tooltip: supportingLink };
    worksheet[supportingLinkCellRef].s = { font: { color: { rgb: "0000FF" }, underline: true } };
  }

  // Preserve column widths or set default
  worksheet['!cols'] = worksheet['!cols'] || [{ wpx: 300 }, { wpx: 300 }, { wpx: 300 }, { wpx: 100 }];

    // Write to file
    XLSX.writeFile(workbook, filePath);
    console.log("Workbook written successfully");
    res.json({ status: 'success' });
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
 // runthe server to activate the extension with going to backend folder and 
 //run command node server.js in the terminal