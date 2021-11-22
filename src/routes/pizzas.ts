import { Application, Request, Response } from "express";
import Pizza from './../models/Pizza';
import { body, validationResult, param, CustomValidator } from 'express-validator';
import { Op } from "sequelize";

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

const isPizzaDuplicateNameIgnoreId: CustomValidator = async (name, id) => {
    const pizza = await Pizza.findOne({
        where: { name: name }
    });

    if (pizza) {
        throw new Error(`You already have a pizza with ${name} name.`);
    }
}

export default function (app: Application) {
    app.get('/pizzas', async (req: Request, res: Response) => {
        const pizzas = await Pizza.findAll();
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
            const pizza = await Pizza.findOne({
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
            const { name } = req.body;

            // สร้าง
            const pizza = await Pizza.create({
                name: name
            });

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
            const { name } = req.body;
            const { id } = req.params;

            // สร้าง
            const pizza = await Pizza.update({
                name: name,
            }, {
                where: { id: id }
            });

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