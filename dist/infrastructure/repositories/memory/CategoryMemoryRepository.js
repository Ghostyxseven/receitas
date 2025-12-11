"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryMemoryRepository = void 0;
class CategoryMemoryRepository {
    constructor() {
        this.items = [];
    }
    async list() {
        return [...this.items];
    }
    async findById(id) {
        return this.items.find((category) => category.id === id);
    }
    async findByName(name) {
        const normalizedName = name.trim().toLowerCase();
        return this.items.find((category) => category.name.toLowerCase() === normalizedName);
    }
    async create(data) {
        const item = {
            id: require("crypto").randomUUID(),
            name: data.name,
            createdAt: new Date(),
        };
        this.items.push(item);
        return item;
    }
    async update(id, data) {
        const idx = this.items.findIndex((category) => category.id === id);
        if (idx < 0)
            throw new Error("Category not found");
        const current = this.items[idx];
        const updated = {
            ...current,
            name: data.name !== undefined ? data.name : current.name,
        };
        this.items[idx] = updated;
        return updated;
    }
    async delete(id) {
        this.items = this.items.filter((category) => category.id !== id);
    }
}
exports.CategoryMemoryRepository = CategoryMemoryRepository;
