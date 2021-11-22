import { Application, Request, Response } from "express";
import Ingredient from "../models/Ingredient";
import { body, validationResult, param, CustomValidator } from 'express-validator';
import { Op } from "sequelize";

const isValidIngredientFromId: CustomValidator = async id => {
    const ingredient = await Ingredient.findOne({
        where: { id: id }
    });

    if (!ingredient) {
        throw new Error(`Ingredient id ${id} does not exists.`);
    }
};

const isIngredientDuplicateName: CustomValidator = async name => {
    const ingredient = await Ingredient.findOne({
        where: { name: name }
    });

    if (ingredient) {
        throw new Error(`You already have a ingredient with ${name} name.`);
    }
}

const isIngredientDuplicateNameIgnoreId: CustomValidator = async (name, obj) => {
    const id = obj.req.params?.id;

    const ingredient = await Ingredient.findOne({
        where: {
            [Op.and]: [{
                name: name,
            }, {
                id: {
                    [Op.ne]: id,
                }
            }],
        },
    });

    if (ingredient) {
        throw new Error(`You already have a ingredient with ${name} name.`);
    }
}

export default function (app: Application) {

    app.get('/ingredients', async (req: Request, res: Response) => {
        const ingredients = await Ingredient.findAll();
        res.send(ingredients);
    });

    app.get(
        '/ingredients/:id',
        param('id').custom(isValidIngredientFromId),

        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;

            const ingredient = await Ingredient.findOne({
                where: { id: id }
            });

            res.send(ingredient);
        }
    );

    app.post(
        '/ingredients',
        body('name').not().isEmpty().trim().escape().custom(isIngredientDuplicateName),

        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, price } = req.body;

            const ingredient = await Ingredient.create({
                name,
                price
            });

            res.send(ingredient);
        }
    );

    app.put(
        "/ingredients/:id",
        param('id').custom(isValidIngredientFromId),
        body('name').not().isEmpty().trim().escape().custom(isIngredientDuplicateNameIgnoreId),

        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, price } = req.body;
            const { id } = req.params;

            const ingredient = await Ingredient.update({
                name: name,
                price: price
            }, {
                where: { id: id }
            });

            res.send(ingredient);
        }
    );

    app.delete(
        '/ingredients/:id',
        param('id').custom(isValidIngredientFromId),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;

            await Ingredient.destroy({
                where: { id: id }
            });

            res.send([]);
        }
    );

}