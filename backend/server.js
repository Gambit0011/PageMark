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
  const { link, comment } = req.body;

  // Load existing workbook or create a new one
  let workbook;
  if (fs.existsSync('links.xlsx')) {
    workbook = XLSX.readFile('links.xlsx');
  } else {
    workbook = XLSX.utils.book_new();
  }

  // Load existing sheet or create a new one
  let worksheet;
  if (workbook.SheetNames.length > 0) {
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    worksheet = XLSX.utils.aoa_to_sheet([['Link', 'Comment']]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Links');
  }

  // Append new data
  const newRow = [link, comment];
  XLSX.utils.sheet_add_aoa(worksheet, [newRow], { origin: -1 });

  // Write to file
  XLSX.writeFile(workbook, 'links.xlsx');

  res.json({ status: 'success' });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
