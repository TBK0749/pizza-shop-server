import { Application, Request, Response } from "express";
import Ingredient from "../models/Ingredient";

export default function (app: Application) {
    // Routes
    // - GET /ingredients
    // - GET /ingredients/:id
    // - POST /ingredients
    // - PUT /ingredients/:id
    // - DELETE /ingredients/:id

    app.get('/ingredients', async (req: Request, res: Response) => {
        const ingredients = await Ingredient.findAll();
        res.send(ingredients);
        // res.send([]);
    });

    // Other routes

    // const ingredient = new Ingredient({
    //     name: 'Garlic!',
    //     price: 5,
    // });
    // ingredient.save();

}