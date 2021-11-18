import { Application, Request, Response } from "express";

export default function (app: Application) {
    // Routes
    // - GET /ingredients
    // - GET /ingredients/:id
    // - POST /ingredients
    // - PUT /ingredients/:id
    // - DELETE /ingredients/:id

    app.get('/ingredients', async (req: Request, res: Response) => {
        res.send([]);
    });

    // Other routes
}