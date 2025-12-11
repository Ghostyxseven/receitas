import { Recipe } from "../../../domain/entities/Recipe"
import {
  CreateRecipeDTO,
  IRecipeRepository,
} from "../../../domain/repositories/IRecipeRepository"

export class RecipeMemoryRepository implements IRecipeRepository {
  private items: Recipe[] = []

  async list(): Promise<Recipe[]> {
    return [...this.items]
  }

  async listByCategoryId(categoryId: string): Promise<Recipe[]> {
    return this.items.filter((recipe) => recipe.categoryId === categoryId)
  }

  async findById(id: string): Promise<Recipe | undefined> {
    return this.items.find((recipe) => recipe.id === id)
  }

  async create(data: CreateRecipeDTO): Promise<Recipe> {
    const item: Recipe = {
      id: require("crypto").randomUUID(),
      title: data.title,
      description: data.description,
      ingredients: [...data.ingredients],
      steps: [...data.steps],
      categoryId: data.categoryId,
      createdAt: new Date(),
    }
    this.items.push(item)
    return item
  }

  async update(
    id: string,
    data: Partial<CreateRecipeDTO>
  ): Promise<Recipe> {
    const idx = this.items.findIndex((recipe) => recipe.id === id)
    if (idx < 0) throw new Error("Recipe not found")
    const current = this.items[idx]
    const updated: Recipe = {
      ...current,
      title: data.title !== undefined ? data.title : current.title,
      description:
        data.description !== undefined ? data.description : current.description,
      ingredients:
        data.ingredients !== undefined ? [...data.ingredients] : current.ingredients,
      steps: data.steps !== undefined ? [...data.steps] : current.steps,
      categoryId:
        data.categoryId !== undefined ? data.categoryId : current.categoryId,
    }
    this.items[idx] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((recipe) => recipe.id !== id)
  }
}
