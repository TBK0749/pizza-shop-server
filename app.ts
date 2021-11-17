import "reflect-metadata";

import express from 'express';
import { Sequelize } from "sequelize-typescript";
import Pizza from "./src/models/Pizza";
import Ingredient from "./src/models/Ingredient";
const app = express();
const port = 3000;

const sequelize = new Sequelize({
    database: 'pizza_shop',
    dialect: 'mysql',
    username: 'root',
    password: '',
    storage: ':memory:',
    models: [__dirname + '/src/models']
})

app.get('/', async (req, res) => {
    // const pizza = new Pizza({
    //     name: 'Something nice!',
    // });
    // pizza.save();

    // const ingredient = new Ingredient({
    //     name: 'Garlic!',
    //     price: 5,
    // });
    // ingredient.save();

    const pizza = await Pizza.findOne({
        where: {
            id: 1,
        },
        include: [Ingredient],
    })

    res.send(pizza);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
