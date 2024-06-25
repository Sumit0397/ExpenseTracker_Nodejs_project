const path = require("path");

const getReportPage = (req,res,next) => {
    res.sendFile(path.join(__dirname,"../","public","views","reports.html"));
}

module.exports = {
    getReportPage
}