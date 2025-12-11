import express from "express"
import { CategoryService } from "../../application/services/CategoryService"
import { RecipeService } from "../../application/services/RecipeService"
import { IngredientService } from "../../application/services/IngredientService"
import { CategoryMemoryRepository } from "../../infrastructure/repositories/memory/CategoryMemoryRepository"
import { IngredientMemoryRepository } from "../../infrastructure/repositories/memory/IngredientMemoryRepository"
import { RecipeMemoryRepository } from "../../infrastructure/repositories/memory/RecipeMemoryRepository"
import { categoriesRoutes } from "./routes/categories"
import { recipesRoutes } from "./routes/recipes"
import { ingredientsRoutes } from "./routes/ingredients"
import { errorHandler } from "./middlewares/errorHandler"

const app = express()
app.use(express.json())

const categoryRepository = new CategoryMemoryRepository()
const ingredientRepository = new IngredientMemoryRepository()
const recipeRepository = new RecipeMemoryRepository()

const categoryService = new CategoryService(categoryRepository, recipeRepository)
const recipeService = new RecipeService(recipeRepository, categoryRepository)
const ingredientService = new IngredientService(ingredientRepository)

app.use("/categories", categoriesRoutes(categoryService))
app.use("/recipes", recipesRoutes(recipeService))
app.use("/ingredients", ingredientsRoutes(ingredientService))
app.use(errorHandler)

const port = Number(process.env.PORT ?? 3000)
app.listen(port, () => {
  process.stdout.write(`server running on http://localhost:${port}\n`)
})

