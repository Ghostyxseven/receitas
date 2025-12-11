"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecipeMemoryRepository = void 0;
class RecipeMemoryRepository {
    constructor() {
        this.items = [];
    }
    async list() {
        return [...this.items];
    }
    async listByCategoryId(categoryId) {
        return this.items.filter((recipe) => recipe.categoryId === categoryId);
    }
    async findById(id) {
        return this.items.find((recipe) => recipe.id === id);
    }
    async create(data) {
        const item = {
            id: require("crypto").randomUUID(),
            title: data.title,
            description: data.description,
            ingredients: [...data.ingredients],
            steps: [...data.steps],
            categoryId: data.categoryId,
            createdAt: new Date(),
        };
        this.items.push(item);
        return item;
    }
    async update(id, data) {
        const idx = this.items.findIndex((recipe) => recipe.id === id);
        if (idx < 0)
            throw new Error("Recipe not found");
        const current = this.items[idx];
        const updated = {
            ...current,
            title: data.title !== undefined ? data.title : current.title,
            description: data.description !== undefined ? data.description : current.description,
            ingredients: data.ingredients !== undefined ? [...data.ingredients] : current.ingredients,
            steps: data.steps !== undefined ? [...data.steps] : current.steps,
            categoryId: data.categoryId !== undefined ? data.categoryId : current.categoryId,
        };
        this.items[idx] = updated;
        return updated;
    }
    async delete(id) {
        this.items = this.items.filter((recipe) => recipe.id !== id);
    }
}
exports.RecipeMemoryRepository = RecipeMemoryRepository;
