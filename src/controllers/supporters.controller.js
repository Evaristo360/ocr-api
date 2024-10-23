const SupportersFinalService = require('../services/supportersFinal.service');
const CommitteesService = require('../services/committees.service');

const supportersFinalService = new SupportersFinalService();
const committeesService = new CommitteesService();

const XLSX = require('xlsx');


const LoadSupporters = async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    console.log(file)
    const workbook = XLSX.read(file.data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const dataCSV = XLSX.utils.sheet_to_csv(sheet);

    const rows = dataCSV.split('\n');
    rows.map((row) => {
        let cells = row.split(',');
        console.log(cells);

    })

    res.send('File uploaded and data printed to console.');
}


module.exports = {
    LoadSupporters
};
