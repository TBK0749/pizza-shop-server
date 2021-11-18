import { BelongsToMany, Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Ingredient from './Ingredient';
import IngredientPizza from './IngredientPizza';

@Table
export default class Pizza extends Model {
    @Column
    name: string;

    @CreatedAt
    created_at: Date;

    @UpdatedAt
    updated_at: Date;

    // Ignore
    @BelongsToMany(() => Ingredient, () => IngredientPizza)
    ingredients: Ingredient[]
}