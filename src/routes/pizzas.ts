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
    });

    app.post("/pizzas", async (req: Request, res: Response) => {
        // อ่านค่าจาก request
        const { name } = req.body;

        // สร้าง
        const pizza = await Pizza.create({
            name: name
        });

        // ส่ง response กลับ
        res.send(pizza);
    });

    // request url (params)
    // request body
    app.put("/pizzas/:id", async (req: Request, res: Response) => {
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
    });

    app.delete("/pizzas/:id", async (req: Request, res: Response) => {
        // อ่านค่าจาก request
        const { id } = req.params;

        // สร้าง
        await Pizza.destroy({
            where: { id: id }
        });

        // ส่ง response กลับ
        res.send([]);
    });

    app.get("/pizzas/:id", async (req: Request, res: Response) => {
        // อ่านค่าจาก request
        const { id } = req.params;

        // สร้าง
        const pizza = await Pizza.findOne({
            where: { id: id }
        });

        // ส่ง response กลับ
        res.send(pizza);
    });
}