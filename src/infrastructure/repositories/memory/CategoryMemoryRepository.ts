import { Category } from "../../../domain/entities/Category"
import {
  CreateCategoryDTO,
  ICategoryRepository,
} from "../../../domain/repositories/ICategoryRepository"

export class CategoryMemoryRepository implements ICategoryRepository {
  private items: Category[] = []

  async list(): Promise<Category[]> {
    return [...this.items]
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.items.find((category) => category.id === id)
  }

  async findByName(name: string): Promise<Category | undefined> {
    const normalizedName = name.trim().toLowerCase()
    return this.items.find(
      (category) => category.name.toLowerCase() === normalizedName
    )
  }

  async create(data: CreateCategoryDTO): Promise<Category> {
    const item: Category = {
      id: require("crypto").randomUUID(),
      name: data.name,
      createdAt: new Date(),
    }
    this.items.push(item)
    return item
  }

  async update(id: string, data: Partial<CreateCategoryDTO>): Promise<Category> {
    const idx = this.items.findIndex((category) => category.id === id)
    if (idx < 0) throw new Error("Category not found")
    const current = this.items[idx]
    const updated: Category = {
      ...current,
      name: data.name !== undefined ? data.name : current.name,
    }
    this.items[idx] = updated
    return updated
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((category) => category.id !== id)
  }
}
