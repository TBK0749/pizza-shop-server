import { Application, Request, Response } from "express";
import Pizza from './../models/Pizza';
import { body, validationResult, param, CustomValidator } from 'express-validator';
import { Op } from "sequelize";
import Ingredient from "../models/Ingredient";
import IngredientPizza from "../models/IngredientPizza";

const isValidPizzaFromId: CustomValidator = async id => {
    const pizza = await Pizza.findOne({
        where: { id: id }
    });

    if (!pizza) {
        throw new Error(`Pizza id ${id} does not exists.`);
    }
};

// isPizzaDuplicateName
const isPizzaDuplicateName: CustomValidator = async name => {
    const pizza = await Pizza.findOne({
        where: { name: name }
    });
    if (pizza) {
        throw new Error(`You already have a pizza with ${name} name.`);
    }
}

const isPizzaDuplicateNameIgnoreId: CustomValidator = async (name, obj) => {
    const id = obj.req.params?.id;

    const pizza = await Pizza.findOne({
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

    if (pizza) {
        throw new Error(`You already have a pizza with ${name} name.`);
    }
}


export default function (app: Application) {
    app.get('/pizzas', async (req: Request, res: Response) => {
        // let include = [];

        // if (req.query.ingredients === '1') {
        //     include.push(Ingredient);
        // }

        const pizzas = await Pizza.findAll({ include: Ingredient });
        res.send(pizzas);
    });

    app.get(
        '/pizzas/:id',

        // https://express-validator.github.io/docs/
        // Validation Logic
        param('id').custom(isValidPizzaFromId),

        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // อ่านค่าจาก request
            const { id } = req.params;

            // สร้าง
            // const pizza = await Pizza.findOne({
            //     where: { id: id }
            // });

            const pizza = await Pizza.findOne({
                include: Ingredient,
                where: { id: id }
            });

            // ส่ง response กลับ
            res.send(pizza);
        }
    );

    app.post(
        '/pizzas',
        // "Hawaii"
        // ["          665554412        "]
        // \\ \ %2F " "
        // Sanitize data
        body('name').not().isEmpty().trim().escape().custom(isPizzaDuplicateName),

        // Homework
        // 1. เพิ่มการเช็คว่าชื่อห้ามซ้ำ (ใช้ custom validator function)

        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // อ่านค่าจาก request
            const { name, ingredient_ids } = req.body;

            // 1. ให้ API user ส่ง ingredient_ids มาด้วยเลย เป็น array ของ ingredient_id
            // UI: 1. เพิ่มฟอร์มให้ user เลือก ingredient ของ pizza ได้
            // UI: 2. เพิ่ม code ตอนส่ง request ให้ส่ง ingredient_ids ที่ user เลือก มาใน body

            // 2. สร้าง route แยก รับ param เป็น pizza id และใน body ให้ส่ง ingredient_ids มา
            // UI: 1. เพิ่มฟอร์มให้ user เลือก ingredient ของ pizza ได้
            // UI: 2. สั่งให้ axios ส่ง request หลังจากสร้าง pizza เสร็จ (เพราะต้องใช้ pizza id ในการ add ingredient ids ในอีก route นึง)

            // สร้าง route ใหม่ POST /pizzas/:id/ingredients create ingredient ของ pizza ที่กำหนด
            // 1. หา pizza ตาม id ที่ส่งมา (ต้อง validate ว่ามีจริงด้วย)
            // 2. สร้างคู่ pizza_id, ingredient_id ใน ingredient_pizzas table.

            // const createdGroup = await Group.create({ ...req.body, groupId, creatorId: userId }); // req.body has name and users properties, users is an array of user objects.
            // สร้าง
            const pizza = await Pizza.create({
                name,
            });

            IngredientPizza.bulkCreate(ingredient_ids.map((ingredientId: number) => (
                {
                    pizza_id: pizza.id,
                    ingredient_id: ingredientId
                }
            )));

            // ส่ง response กลับ
            res.send(pizza);
        }
    );

    // request url (params)
    // request body
    app.put(
        "/pizzas/:id",
        param('id').custom(isValidPizzaFromId), // ID มีอยู่จริง
        body('name').not().isEmpty().trim().escape().custom(async (name, obj) => {
            const id = obj.req.params?.id;

            // Find the one that has name = name, but not the one that has id = id

            // https://sequelize.org/master/manual/model-querying-basics.html
            // Operators
            // SELECT * FROM pizzas WHERE id = 5
            // SELECT * FROM pizzas WHERE name = 'Q'
            // SELECT * FROM pizzas WHERE name = 'Q' AND id != 9
            // const pizza = await Pizza.findOne({
            //     where: { name: name },
            // });

            const pizza = await Pizza.findOne({
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

            // npx create-react-app pizza-shop --template typescript

            if (pizza) {
                throw new Error(`You already have a pizza with ${name} name.`);
            }
        }),
        // Homework 2
        // เพิ่ม duplicate name check เช่นกัน แต่ให้มัน ignore id ของตัวเอง

        // id = 2
        // name = Hawaii

        // 

        // Homework 3 คือทำทุกอย่างตามไฟล์นี้ แต่เป็นสำหรับ ingredient
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // อ่านค่าจาก request
            const { name, ingredient_ids } = req.body;
            const { id } = req.params;

            // สร้าง

            // Update pizza
            const pizza = await Pizza.update({
                include: Ingredient,
                name: name,
            }, {
                where: { id: id }
            });


            IngredientPizza.destroy({
                where: { pizza_id: id }
            }).then(() =>
                IngredientPizza.bulkCreate(ingredient_ids.map((ingredientId: number) => (
                    {
                        pizza_id: id,
                        ingredient_id: ingredientId
                    }
                )))
            );

            // ส่ง response กลับ
            res.send(pizza);
        }
    );

    app.delete(
        '/pizzas/:id',
        param('id').custom(isValidPizzaFromId),
        async (req: Request, res: Response) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // อ่านค่าจาก request
            const { id } = req.params;

            // สร้าง
            await Pizza.destroy({
                where: { id: id }
            });

            // ส่ง response กลับ
            res.send([]);
        }
    );
}