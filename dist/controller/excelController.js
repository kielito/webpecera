"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CargarCSVSchema = void 0;
function CargarCSVSchema(req, res, next) {
    try {
        let filePath = __basedir + "/uploads/" + req.file.filename;
        readXlsxFile(filePath).then(rows => {
            // `rows` is an array of rows
            // each row being an array of cells.   
            console.log(rows);
            // Remove Header ROW
            rows.shift();
            const customers = [];
            let length = rows.length;
            for (let i = 0; i < length; i++) {
                let customer = {
                    id: rows[i][0],
                    name: rows[i][1],
                    address: rows[i][2],
                    age: rows[i][3]
                };
                customers.push(customer);
            }
            Customer.bulkCreate(customers).then(() => {
                const result = {
                    status: "ok",
                    filename: req.file.originalname,
                    message: "Upload Successfully!",
                };
                res.json(result);
            });
        });
    }
    catch (error) {
        const result = {
            status: "fail",
            filename: req.file.originalname,
            message: "Upload Error! message = " + error.message
        };
        res.json(result);
    }
    next();
}
exports.CargarCSVSchema = CargarCSVSchema;
//# sourceMappingURL=excelController.js.map