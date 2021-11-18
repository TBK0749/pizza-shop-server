import { Application, Request, Response } from "express";
import Pizza from './../models/Pizza';

export default function (app: Application) {
    // Routes
    // - GET /pizzas
    // - GET /pizzas/:id
    // - POST /pizzas
    // - PUT /pizzas/:id
    // - DELETE /pizzas/:id

    // https://www.npmjs.com/package/sequelize-typescript

    app.get('/pizzas', async (req: Request, res: Response) => {
        const pizzas = await Pizza.findAll();
        res.send(pizzas);

        // const pizza = new Pizza({
        //     name: 'Seafood Pizza',
        // });
        // pizza.save();
        // res.send([]);
    });

    // Other routes
    // const pizza = new Pizza({
    //     name: 'Something nice!',
    // });
    // pizza.save();

    // const ingredient = new Ingredient({
    //     name: 'Garlic!',
    //     price: 5,
    // });
    // ingredient.save();

    // const pizza = await Pizza.findOne({
    //     where: {
    //         id: 1,
    //     },
    //     include: [Ingredient],
    // })
}