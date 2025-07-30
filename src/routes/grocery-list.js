import express from "express";
import { PrismaClient } from "@prisma/client";
import { aggregateIngredients } from "../utils/aggregateIngredients.js";

const prisma = new PrismaClient();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { recipeIds } = req.body;
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res
        .status(400)
        .json({ error: "recipeIds must be a non-empty array" });
    }

    // Fetch recipes with ingredients
    const recipes = await prisma.recipe.findMany({
      where: { id: { in: recipeIds } },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    if (!recipes.length) {
      return res
        .status(404)
        .json({ error: "No recipes found for provided IDs" });
    }

    // Aggregate ingredients using your existing logic
    const groceryList = aggregateIngredients(recipes);
    const groceryListObj = Object.fromEntries(groceryList);

    res.json({ groceryList: groceryListObj });
  } catch (error) {
    console.error("Error generating grocery list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
