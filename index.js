const app = require('express')();
const PORT = 3000;

app.use('/hunters', require("./controllers/HunterController.js"));

app.get('/', (req, res) => res.send('E-hunter API'));
app.listen(PORT, () => console.log('E-hunter backend running at port 3000'));