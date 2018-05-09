const app = require('express')();
const bodyParser = require('body-parser');
const PORT = 3000;

app.use(bodyParser.json())

app.use('/hunters', require("./controllers/HunterController.js"));
app.use('/companies', require("./controllers/CompanyController.js"));
app.use('/vacancies', require("./controllers/VacancyController.js"));
app.use('/categories', require("./controllers/CategoryController.js"));

app.get('/', (req, res) => res.send('E-hunter API'));
app.listen(PORT, () => console.log('E-hunter backend running at port 3000'));