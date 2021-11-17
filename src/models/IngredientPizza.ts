import { Column, ForeignKey, Model, Table } from 'sequelize-typescript'
import Ingredient from './Ingredient'
import Pizza from './Pizza'

@Table({
    tableName: 'ingredient_pizza',
    timestamps: false,
})
export default class IngredientPizza extends Model {
    @ForeignKey(() => Pizza)
    @Column
    pizza_id: number

    @ForeignKey(() => Ingredient)
    @Column
    ingredient_id: number
}