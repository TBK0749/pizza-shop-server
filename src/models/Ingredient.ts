import { BelongsToMany, Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import IngredientPizza from './IngredientPizza';
import Pizza from './Pizza';

@Table
export default class Ingredient extends Model {
    @Column
    name: string;

    @Column
    price: number;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    // Ignore
    @BelongsToMany(() => Pizza, () => IngredientPizza)
    pizzas: Pizza[]
}