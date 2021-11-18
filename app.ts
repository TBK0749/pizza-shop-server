import express from 'express';
import bodyParser from 'body-parser';
import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import LoadIngredientRoutes from "./src/routes/ingredients";
import LoadPizzaRoutes from "./src/routes/pizzas";

const app = express();
app.use(bodyParser.json());
const port = 3000;

const sequelize = new Sequelize({
    database: 'pizza_shop',
    dialect: 'mysql',
    username: 'root',
    password: '07490749',
    storage: ':memory:',
    models: [__dirname + '/src/models']
});

app.get('/', async (req, res) => {
    res.send('The server is running!');
});

LoadPizzaRoutes(app);
LoadIngredientRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
