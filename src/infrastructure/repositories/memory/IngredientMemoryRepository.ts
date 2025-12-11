import { Ingredient } from "../../../domain/entities/Ingredient"
import {
  CreateIngredientDTO,
  IIngredientRepository,
} from "../../../domain/repositories/IIngredientRepository"

export class IngredientMemoryRepository implements IIngredientRepository {
  private items: Ingredient[] = []

  async list(): Promise<Ingredient[]> {
    return [...this.items]
  }

  async findById(id: string): Promise<Ingredient | undefined> {
    return this.items.find((ingredient) => ingredient.id === id)
  }

  async findByName(name: string): Promise<Ingredient | undefined> {
    const normalizedName = name.trim().toLowerCase()
    return this.items.find(
      (ingredient) => ingredient.name.toLowerCase() === normalizedName
    )
  }

  async create(data: CreateIngredientDTO): Promise<Ingredient> {
    const item: Ingredient = {
      id: require("crypto").randomUUID(),
      name: data.name,
      createdAt: new Date(),
    }
    this.items.push(item)
    return item
  }

  async update(
    id: string,
    data: Partial<CreateIngredientDTO>
  ): Promise<Ingredient> {
    const idx = this.items.findIndex((ingredient) => ingredient.id === id)
    if (idx < 0) throw new Error("Ingredient not found")
    const current = this.items[idx]
    const updated: Ingredient = {
      ...current,
      name: data.name !== undefined ? data.name : current.name,
    }
    this.items[idx] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((ingredient) => ingredient.id !== id)
  }
}
