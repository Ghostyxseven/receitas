import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository"
import { IRecipeRepository } from "../../domain/repositories/IRecipeRepository"
import { Category } from "../../domain/entities/Category"
 

export class CategoryService {
  constructor(
    private readonly categories: ICategoryRepository,
    private readonly recipes: IRecipeRepository
  ) {}

  async create(data: { name: string }): Promise<Category> {
    const name = data.name.trim()
    if (!name) throw new Error("Name is required")
    const exists = await this.categories.findByName(name)
    if (exists) throw new Error("Category name must be unique")
    return this.categories.create({ name })
  }

  async list(): Promise<Category[]> {
    return this.categories.list()
  }

  async get(id: string): Promise<Category> {
    const found = await this.categories.findById(id)
    if (!found) throw new Error("Category not found")
    return found
  }

  async update(
    id: string,
    data: { name?: string }
  ): Promise<Category> {
    if (data.name) {
      const name = data.name.trim()
      const existing = await this.categories.findByName(name)
      if (existing && existing.id !== id)
        throw new Error("Category name must be unique")
      return this.categories.update(id, { name })
    }
    return this.categories.update(id, data)
  }

  async delete(id: string): Promise<void> {
    const recipes = await this.recipes.listByCategoryId(id)
    if (recipes.length > 0)
      throw new Error("Cannot delete category with recipes")
    await this.categories.delete(id)
  }
}
