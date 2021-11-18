import express from 'express';
import bodyParser from 'body-parser';
import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import LoadIngredientRoutes from "./src/routes/ingredients";
import LoadPizzaRoutes from "./src/routes/pizzas";
import { createRouting, number, query, segment, uuid } from 'ts-routes';

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
    res.send('The server is running! eiei');
});

// const routes = createRouting({
//     products: segment`/products`,
//     users: segment`/users/${number('userId')}`,
// });

// routes.products(); // '/products'
// routes.products.pattern // '/products'

// routes.users({ userId: '10' }) // '/users/10'
// routes.users.pattern // '/users/:userId([0-9]+)

LoadPizzaRoutes(app);
LoadIngredientRoutes(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
