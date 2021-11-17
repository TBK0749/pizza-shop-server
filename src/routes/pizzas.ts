import { Application, Request, Response } from "express";

export default function (app: Application) {
    app.get('/pizzas', async (req: Request, res: Response) => {
        res.send([]);
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