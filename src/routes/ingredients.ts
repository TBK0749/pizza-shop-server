import { Application, Request, Response } from "express";

export default function (app: Application) {
    app.get('/ingredients', async (req: Request, res: Response) => {
        res.send([]);
    });

    // Other routes
}