const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({ data: tableContent });
});

// -------------------------------------------------------------------------------------------

router.post('/insert-recipe', async (req, res) => {
    const { recipeID, cName, timeEstimate, servings, title, instructions } = req.body;
    const result = await appService.insertRecipe(recipeID, cName, timeEstimate, servings, title, instructions);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-recipe', async (req, res) => {
    const { recipeID, cName, timeEstimate, servings, title, instructions, ingredients, ingredientAmounts } = req.body;
    const updateRecipe = await appService.updateRecipe(recipeID, cName, timeEstimate, servings, title, instructions);

    var allSuccess = updateRecipe;
    var errorString = "Recipe updated: " + updateRecipe.toString();

    if (updateRecipe) {
        const delIng = await appService.deleteContainsIng(recipeID);
        allSuccess = allSuccess && delIng;
        if (!delIng) {
            errorString += ", failed ingredient deletions";
        } else {
            errorString += ", failed ingredient inserts: ";

            for (let i = 0; i < ingredients.length; i++) {
                const ingResult = await appService.insertContainsIng(recipeID, ingredients[i], ingredientAmounts[i]);
                allSuccess = allSuccess && ingResult;
                if (!ingResult) {
                    errorString += ingredients[i] + ", ";
                }
            }

            if (errorString.at(-2) === ",") {
                errorString = errorString.slice(0, -2);
            }
        }
    }
    if (allSuccess) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, recipeUpdateSuccess: updateRecipe, error: errorString });
    }
});

router.post('/delete-recipe', async (req, res) => {
    const { recipeID } = req.body;
    const result = await appService.deleteRecipe(recipeID);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/select-recipe', async (req, res) => {
    const { clauses, predicates, contains, notContains } = req.body;
    const result = await appService.selectRecipe(clauses, predicates, contains, notContains); // both arrays of strings
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error }); // if instead the user is allowed to freely
    } else {                                                          // choose clauses/predicates, error should be 4xx instead of 500
        res.json({ success: true, recipes: result });
    }
});

router.post('/project-recipe', async (req, res) => {
    const { attributes } = req.body;
    const result = await appService.projectRecipe(attributes);
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error }); // as above comment
    } else {
        res.json({ success: true, projection: result });
    }
});

router.post('/join-recipe', async (req, res) => {
    const { recipeID } = req.body;
    const result = await appService.joinRecipe(recipeID);
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error }); // as above comment
    } else {
        res.json({ success: true, join: result });
    }
});

router.get('/avgRatingByRecipe', async (req, res) => {
    const avgs = await appService.avgRatingByRecipe();
    if (Object.hasOwn(avgs, 'error')) {
        res.status(500).json({ success: false, error: avgs.error }); // as above comment
    } else {
        res.json({ success: true, avgRatings: avgs });
    }
});

router.post('/verify-user', async (req, res) => {
    const { userName, userPassword } = req.body;
    const result = await appService.verifyUser(userName, userPassword);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

router.post('/insert-creates', async (req, res) => {
    const { userName, recID } = req.body;
    const result = await appService.insertCreates(userName, recID);
    res.json({ success: result });
});

// note requires generating an ID in the frontend
router.post('/insert-review', async (req, res) => {
    const { reviewID, userName, recID, rating, comment, date } = req.body;
    const result = await appService.insertReview(reviewID, recID, userName, rating, comment, date);
    res.json({ success: result });
});

router.post('/insert-contains-ing', async (req, res) => {
    const { recID, iName, amount } = req.body;
    const result = await appService.insertContainsIng(recID, iName, amount);
    res.json({ success: result });
});

router.post('/fetch-ingredients', async (req, res) => {
    const { recID } = req.body;
    const ing = await appService.fetchIngredients(recID);
    if (Object.hasOwn(ing, 'error')) {
        res.status(500).json({ success: false, error: ing.error });
    } else {
        res.json({ success: true, ingredients: ing });
    }
});

router.post('/fetch-reviews', async (req, res) => {
    const { recID } = req.body;
    const rev = await appService.fetchReviews(recID);
    if (Object.hasOwn(rev, 'error')) {
        res.status(500).json({ success: false, error: rev.error });
    } else {
        res.json({ success: true, reviews: rev });
    }
});

router.post('/fetch-recipes', async (req, res) => {
    const { userName } = req.body;
    const rec = await appService.fetchRecipies(userName);
    if (Object.hasOwn(rec, 'error')) {
        res.status(500).json({ success: false, error: rec.error });
    } else {
        res.json({ success: true, recipes: rec });
    }
});

//assumes ingredients and ingredientAmounts arrays are of same length and in corresponding order
//note a recipe will still be inserted even if not all ingredient inserts succeed
router.post('/submit-recipe', async (req, res) => {
    const { recipeID, cName, timeEstimate, servings, title, instructions, ingredients, ingredientAmounts } = req.body;

    const insertRecipe = await appService.insertRecipe(recipeID, cName, timeEstimate, servings, title, instructions);

    var allSuccess = insertRecipe;
    var errorString = "Recipe inserted: " + insertRecipe.toString();

    if (insertRecipe) {
        errorString += ", failed ingredient inserts: ";

        for (let i = 0; i < ingredients.length; i++) {
            const ingResult = await appService.insertContainsIng(recipeID, ingredients[i], ingredientAmounts[i]);
            allSuccess = allSuccess && ingResult;
            if (!ingResult) {
                errorString += ingredients[i] + ", ";
            }
        }

        if (errorString.at(-2) === ",") {
            errorString = errorString.slice(0, -2);
        }
    }

    if (allSuccess) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, insertSuccess: insertRecipe, error: errorString });
    }
});

router.get('/fetch-popular-recipes', async (req, res) => {
    const rec = await appService.fetchPopularRecipes();
    if (Object.hasOwn(rec, 'error')) {
        res.status(500).json({ success: false, error: rec.error });
    } else {
        res.json({ success: true, recipes: rec });
    }
});

router.get('/fetch-top-cuisine', async (req, res) => {
    const cuis = await appService.fetchTopCuisine();
    if (Object.hasOwn(cuis, 'error')) {
        res.status(500).json({ success: false, error: cuis.error });
    } else {
        res.json({ success: true, cuisine: cuis });
    }
});

router.post('/fetch-expert-user', async (req, res) => {
    const { cName } = req.body;
    const user = await appService.fetchExpertUser(cName);
    if (Object.hasOwn(user, 'error')) {
        res.status(500).json({ success: false, error: user.error });
    } else {
        res.json({ success: true, users: user });
    }
});

router.post('/project-review', async (req, res) => {
    const { attributes } = req.body;
    const result = await appService.projectReview(attributes);
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error });
    } else {
        res.json({ success: true, reviews: result });
    }
});

router.post('/user-created-recipe', async (req, res) => {
    const { userName, recID } = req.body;
    const created = await appService.userCreatedRecipe(userName, recID);
    res.json({ result: created });
});

router.post('/insert-saves', async (req, res) => {
    const { userName, recID } = req.body;
    const result = await appService.insertSaves(userName, recID);
    res.json({ success: result });
});

router.post('/delete-saves', async (req, res) => {
    const { userName, recID } = req.body;
    const result = await appService.deleteSaves(userName, recID);
    res.json({ success: result });
});

router.post('/join-saved-recipes', async (req, res) => {
    const { userName } = req.body;
    const result = await appService.joinSavedRecipes(userName);
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error });
    } else {
        res.json({ success: true, savedRecipes: result });
    }
});

router.get('/fetch-all-ingredients', async (req, res) => {
    const ingredients = await appService.fetchAllIngredients();
    res.json(ingredients);
});

router.post('/associated-with-org', async (req, res) => {
    const { userName } = req.body;
    const result = await appService.fetchAssociatedOrgsForUser(userName);
    if (Object.hasOwn(result, 'error')) {
        res.status(500).json({ success: false, error: result.error });
    } else {
        res.json({ success: true, orgs: result });
    }
});

router.post('/fetch-user-position', async (req, res) => {
    const { userName } = req.body;
    const position = await appService.fetchPositionForUser(userName);
    if (Object.hasOwn(position, 'error')) {
        res.status(500).json({ success: false, error: position.error });
    } else {
        res.json({ success: true, position: position });
    }
});

router.post('/fetch-avg-review-for-recipe', async (req, res) => {
    const { recID } = req.body;
    const rev = await appService.avgRatingForRecipeId(recID);
    if (Object.hasOwn(rev, 'error')) {
        res.status(500).json({ success: false, error: rev.error });
    } else {
        res.json({ success: true, average: rev });
    }
});


// ----------------------------------------------------------

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-demotable", async (req, res) => {
    const { id, name } = req.body;
    const insertResult = await appService.insertDemotable(id, name);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { oldName, newName } = req.body;
    const updateResult = await appService.updateNameDemotable(oldName, newName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-demotable', async (req, res) => {
    const tableCount = await appService.countDemotable();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});


module.exports = router;