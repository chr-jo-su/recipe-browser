const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

oracledb.fetchAsString = [oracledb.CLOB];

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);
        console.log('Connection pool started');
        
        // UNCOMMENT TO TEST
        // await testInsertRecipe();
        // await testUpdateRecipe();
        // await testSelectRecipe();
        // await testProjectRecipe();
        // await testJoinRecipe();
        // await testAggregationGroupBy();
        // await testAggregationHaving();
        // await testNestedAggregation();
        // await testVerifyUser();
        // await testUserCreatedRecipe();
        // await testFetchIngredients();
        // await testFetchReviews();
        // await testFetchRecipies();
        // await testDivision();
        // await testDeleteRecipe();
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testInsertRecipe() {
    const inserted = await insertRecipe(99999, 'Italian', 30, 2, 'Test Insert', 'Test instructions');
    if (inserted) {
        console.log('Insert Recipe test: SUCCESS');
    } else {
        console.error('Insert Recipe test: FAILED');
    }
    return inserted;
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testDeleteRecipe() {
    const deleted = await deleteRecipe(0);
    if (deleted) {
        console.log('Delete Recipe test: SUCCESS');
    } else {
        console.error('Delete Recipe test: FAILED');
    }
    return deleted;
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testUpdateRecipe() {
    const updated = await updateRecipe(99999, null, 99, null, 'Updated Title', 'Updated instructions');
    if (updated) {
        console.log('Update Recipe test: SUCCESS');
    } else {
        console.error('Update Recipe test: FAILED');
    }
    return updated;
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testSelectRecipe() {
    const result = await selectRecipe(
        ['AND'],
        ["TimeEstimate < 100", "CName = 'Italian'"]
    );
    if (Array.isArray(result)) {
        console.log('Select Recipe test: SUCCESS', result);
    } else {
        console.error('Select Recipe test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testJoinRecipe() {
    const result = await joinRecipe(4);
    if (Array.isArray(result)) {
        console.log('Join Recipe test: SUCCESS', result);
    } else {
        console.error('Join Recipe test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testAggregationGroupBy() {
    const result = await avgRatingByRecipe();
    if (Array.isArray(result)) {
        console.log('Aggregation GROUP BY test: SUCCESS', result, 'rows');
    } else {
        console.error('Aggregation GROUP BY test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testAggregationHaving() {
    const result = await fetchPopularRecipes();
    if (Array.isArray(result)) {
        console.log('Aggregation HAVING test: SUCCESS', result);
    } else {
        console.error('Aggregation HAVING test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testNestedAggregation() {
    const result = await fetchTopCuisine();
    if (Array.isArray(result)) {
        console.log('Nested Aggregation test: SUCCESS', result);
    } else {
        console.error('Nested Aggregation test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testProjectRecipe() {
    const result = await projectRecipe(['Title', 'RecipeID', 'CName']);
    if (Array.isArray(result)) {
        console.log('Project Recipe test: SUCCESS', result);
    } else {
        console.error('Project Recipe test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testVerifyUser() {
    const valid = await verifyUser('JoeBurger', 'placeholder');
    const invalid = await verifyUser('JoeBurger', 'wrong-password');
    if (valid && !invalid) {
        console.log('Verify User test: SUCCESS');
    } else {
        console.error('Verify User test: FAILED', { valid, invalid });
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testUserCreatedRecipe() {
    const yes = await userCreatedRecipe('JoeBurger', 2);
    const no = await userCreatedRecipe('JoeBurger', 0);
    if (yes && !no) {
        console.log('User Created Recipe test: SUCCESS');
    } else {
        console.error('User Created Recipe test: FAILED', { yes, no });
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testFetchIngredients() {
    const result = await fetchIngredients(0);
    if (Array.isArray(result)) {
        console.log('Fetch Ingredients test: SUCCESS', result);
    } else {
        console.error('Fetch Ingredients test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testFetchReviews() {
    const result = await fetchReviews(4);
    if (Array.isArray(result)) {
        console.log('Fetch Reviews test: SUCCESS', result);
    } else {
        console.error('Fetch Reviews test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testFetchRecipies() {
    const result = await fetchRecipies('Batman');
    if (Array.isArray(result)) {
        console.log('Fetch Recipies test: SUCCESS', result);
    } else {
        console.error('Fetch Recipies test: FAILED', result.error);
    }
}

// TEMPORARY TEST (WILL BE DELETED LATER), checking the database manually afterwards to confirm
async function testDivision() {
    const result = await fetchExpertUser('Indian');
    if (Array.isArray(result)) {
        console.log('Division test: SUCCESS', result);
    } else {
        console.error('Division test: FAILED', result.error);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM DEMOTABLE');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateDemotable() {
    return await withOracleDB(async (connection) => {
        try {
            await connection.execute(`DROP TABLE DEMOTABLE`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE DEMOTABLE (
                id NUMBER PRIMARY KEY,
                name VARCHAR2(20)
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDemotable(id, name) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO DEMOTABLE (id, name) VALUES (:id, :name)`,
            [id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(oldName, newName) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE DEMOTABLE SET name=:newName where name=:oldName`,
            [newName, oldName],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countDemotable() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM DEMOTABLE');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}


// Recipe DELETE (Query 3)
async function deleteRecipe(recipeId) {
    return await withOracleDB(async (connection) => {
        await connection.execute('DELETE FROM Review WHERE RecID = :id', [recipeId], { autoCommit: true });
        await connection.execute('DELETE FROM RecipeBelongsToOrg WHERE RecID = :id', [recipeId], { autoCommit: true });
        await connection.execute('DELETE FROM UsesEquip WHERE RecID = :id', [recipeId], { autoCommit: true });
        await connection.execute('DELETE FROM Saves WHERE RecID = :id', [recipeId], { autoCommit: true });
        await connection.execute('DELETE FROM Creates WHERE RecID = :id', [recipeId], { autoCommit: true });
        await connection.execute('DELETE FROM ContainsIng WHERE RecID = :id', [recipeId], { autoCommit: true });
        const result = await connection.execute('DELETE FROM Recipe WHERE RecipeID = :id', [recipeId], { autoCommit: true });
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('deleteRecipe error:', err);
        return false;
    });
}

// Recipe UPDATE (Query 2)
async function updateRecipe(recipeId, cName, timeEstimate, servings, title, instructions) {
    return await withOracleDB(async (connection) => {
        const setClauses = [];
        const params = { recipeId };

        if (cName !== undefined && cName !== null) {
            setClauses.push('CName = :cName');
            params.cName = cName;
        }
        if (timeEstimate !== undefined && timeEstimate !== null) {
            setClauses.push('TimeEstimate = :timeEstimate');
            params.timeEstimate = timeEstimate;
        }
        if (servings !== undefined && servings !== null) {
            setClauses.push('Servings = :servings');
            params.servings = servings;
        }
        if (title !== undefined && title !== null) {
            setClauses.push('Title = :title');
            params.title = title;
        }
        if (instructions !== undefined && instructions !== null) {
            setClauses.push('Instructions = :instructions');
            params.instructions = instructions;
        }

        if (setClauses.length === 0) {
            return false;
        }

        const result = await connection.execute(
            `UPDATE Recipe SET ${setClauses.join(', ')} WHERE RecipeID = :recipeId`,
            params,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('updateRecipe FK error:', err.message);
        } else {
            console.error('updateRecipe error:', err);
        }
        return false;
    });
}


// Recipe SELECTION (Query 4) 
// clauses[i] goes between predicates[i] and predicates[i+1]
// Example :    selectRecipe(['AND', 'OR'], [p0, p1, p2])
async function selectRecipe(clauses, predicates, contains, notContains) {
    try {
        return await withOracleDB(async (connection) => {
            let sql = 'SELECT * FROM Recipe';
            if (predicates && predicates.length > 0) {
                let whereClause = predicates[0];
                for (let i = 0; i < predicates.length - 1; i++) {
                    const clause = clauses[i] || 'AND';
                    whereClause += ' ' + clause + ' ' + predicates[i + 1];
                }
                sql += ' WHERE ' + whereClause;
            }
            var result;
            if (contains && contains.length > 0) {
                const containsBind = contains.map((ingredient, index) => `:${index}`);
                let contClause = '(RecipeID IN (SELECT RecID FROM ContainsIng WHERE IName IN (' + containsBind.join(',') + ') GROUP BY RecID HAVING COUNT(DISTINCT IName) = ' + contains.length + '))';
                sql += (predicates && predicates.length > 0) ? ' AND ' + contClause : ' WHERE ' + contClause;
            }

            if (notContains && notContains.length > 0) {
                const notContainsBind = notContains.map((ingredient, index) => `:not${index}`);
                let notContClause = '(RecipeID NOT IN (SELECT RecID FROM ContainsIng WHERE IName IN (' + notContainsBind.join(',') + ')))';
                sql += ((predicates && predicates.length > 0) || (contains && contains.length > 0)) ? ' AND ' + notContClause : ' WHERE ' + notContClause;
            }
            
            if (notContains && notContains.length > 0 && contains && contains.length > 0) {
                result = await connection.execute(sql, [...contains, ...notContains]);
            } else if (contains && contains.length > 0) {
                result = await connection.execute(sql, [...contains]);
            } else if (notContains && notContains.length > 0) {
                result = await connection.execute(sql, [...notContains]);
            } else {
                result = await connection.execute(sql);
            }
            return result.rows || [];
        });
    } catch (err) {
        console.error('selectRecipe error:', err);
        return { error: 'invalid query' };
    }
}

// Recipe PROJECTION (Query 5)
// attributes paramter example = ['Title', 'RecipeID', 'CName']
// if attributes is [], function returns [].
async function projectRecipe(attributes) {
    try {
        if (!attributes || attributes.length === 0) {
            return [];
        }
        return await withOracleDB(async (connection) => {
            const sql = 'SELECT ' + attributes.join(', ') + ' FROM Recipe';
            const result = await connection.execute(sql);
            return result.rows || [];
        });
    } catch (err) {
        console.error('projectRecipe error:', err);
        return { error: 'invalid query' };
    }
}

// attributes paramter example = ['ReviewID', 'RecID', 'UserName', 'Rating', 'ReviewComment', 'ReviewDate']
// if attributes is [], function returns [].
async function projectReview(attributes) {
    try {
        if (!attributes || attributes.length === 0) {
            return [];
        }
        return await withOracleDB(async (connection) => {
            const sql = 'SELECT ' + attributes.join(', ') + ' FROM Review';
            const result = await connection.execute(sql);
            return result.rows || [];
        });
    } catch (err) {
        console.error('projectReview error:', err);
        return { error: 'invalid query' };
    }
}

// Recipe JOIN (Query 6) 
// Joins Recipe and Review, returns the reviews for the recipe with the given input ID
async function joinRecipe(recipeId) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(        // TO_CHAR needed for ReviewComment otherwise it is printed as a Lob object
                `SELECT R.RecipeID, R.CName, R.TimeEstimate, R.Servings, R.Title,
                        TO_CHAR(R.Instructions) AS Instructions,
                        REV.ReviewID, REV.UserName, REV.Rating,
                        TO_CHAR(REV.ReviewComment) AS ReviewComment,
                        REV.ReviewDate
                 FROM Recipe R
                 JOIN Review REV ON R.RecipeID = REV.RecID
                 WHERE R.RecipeID = :recipeId`,
                [recipeId],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('joinRecipe error:', err);
        return { error: 'invalid query' };
    }
}

// JOIN (Query 6) 
// join Saves and Recipe
// returns all recipes that are saved by the user with the given userName
async function joinSavedRecipes(userName) {
    try {
        if (userName === undefined || userName === null || userName === '') {
            return [];
        }
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT R.RecipeID,
                        R.CName,
                        R.TimeEstimate,
                        R.Servings,
                        R.Title,
                        TO_CHAR(R.Instructions) AS Instructions
                 FROM Saves S
                 JOIN Recipe R ON S.RecID = R.RecipeID
                 WHERE S.UserName = :userName`,
                [userName],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('joinSavedRecipes error:', err);
        return { error: 'invalid query' };
    }
}

// Query 7 (hardcoded): Aggregation with GROUP BY
// Returns rows with average ratings for each recipe
async function avgRatingByRecipe() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT R.RecipeID,
                        R.Title,
                        AVG(REV.Rating) AS AvgRating
                 FROM Recipe R
                 INNER JOIN Review REV ON R.RecipeID = REV.RecID
                 GROUP BY R.RecipeID, R.Title
                 ORDER BY R.RecipeID`
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('avgRatingByRecipe error:', err);
        return { error: 'invalid query' };
    }
}

// Query 8 (hardcoded): Aggregation with HAVING
// returns up to 3 random recipes that have at least 2 reviews
async function fetchPopularRecipes() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT * FROM (
                    SELECT *
                    FROM Recipe R
                    WHERE R.RecipeID IN (
                        SELECT REV.RecID
                        FROM Review REV
                        GROUP BY REV.RecID
                        HAVING COUNT(*) >= 2
                    )
                    ORDER BY DBMS_RANDOM.VALUE
                 )
                 WHERE ROWNUM <= 3`
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchPopularRecipes error:', err);
        return { error: 'invalid query' };
    }
}

// Query 9 (hardcoded): Nested aggregation with GROUP BY
// returns cuisine (CName, and the average rating) with greatest average recipe rating by:
// averaging ratings per recipe then averaging those per recipe averages per cuisine.
async function fetchTopCuisine() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT * FROM (
                    SELECT recipe_avgs.CName,
                           AVG(recipe_avgs.RecipeAvgRating) AS CuisineAvgRecipeRating
                    FROM (
                        SELECT R.CName,
                               R.RecipeID,
                               AVG(REV.Rating) AS RecipeAvgRating
                        FROM Recipe R
                        INNER JOIN Review REV ON R.RecipeID = REV.RecID
                        GROUP BY R.CName, R.RecipeID
                    ) recipe_avgs
                    GROUP BY recipe_avgs.CName
                    ORDER BY CuisineAvgRecipeRating DESC
                 )
                 WHERE ROWNUM = 1`
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchTopCuisine error:', err);
        return { error: 'invalid query' };
    }
}


// returns all ingredients that are in the recipe with the given recId
async function fetchIngredients(recId) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT RecID, IName, Amount FROM ContainsIng WHERE RecID = :recId ORDER BY IName`,
                [recId],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchIngredients error:', err);
        return { error: 'invalid query' };
    }
}


// returns all reviews for the recipe with the given recId
async function fetchReviews(recId) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT ReviewID, RecID, UserName, Rating,
                        TO_CHAR(ReviewComment) AS ReviewComment,
                        ReviewDate
                 FROM Review
                 WHERE RecID = :recId
                 ORDER BY ReviewID`,
                [recId],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchReviews error:', err);
        return { error: 'invalid query' };
    }
}


// returns all recipes the user with the given userName has created
async function fetchRecipies(userName) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT C.UserName AS CreatorUserName,
                        R.RecipeID, R.CName, R.TimeEstimate, R.Servings, R.Title,
                        TO_CHAR(R.Instructions) AS Instructions
                 FROM Creates C
                 INNER JOIN Recipe R ON C.RecID = R.RecipeID
                 WHERE C.UserName = :userName
                 ORDER BY R.RecipeID`,
                [userName],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchRecipies error:', err);
        return { error: 'invalid query' };
    }
}

// Query 10 (division): return users who reviewed every recipe in the given cuisine
// Input: cName
async function fetchExpertUser(cName) {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT u.UserName
                 FROM AppUser u
                 WHERE NOT EXISTS (
                     SELECT r.RecipeID
                     FROM Recipe r
                     WHERE r.CName = :cName
                       AND NOT EXISTS (
                           SELECT 1
                           FROM Review v
                           WHERE v.UserName = u.UserName
                             AND v.RecID = r.RecipeID
                       )
                 )
                 ORDER BY u.UserName`,
                [cName],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchExpertUser error:', err);
        return { error: 'invalid query' };
    }
}


// returns true if AppUser row exists with matching UserName and UserPassword
async function verifyUser(userName, userPassword) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT COUNT(*) AS cnt FROM AppUser WHERE UserName = :userName AND UserPassword = :userPassword`,
            [userName, userPassword],
            { autoCommit: true }
        );
        const count = result.rows[0][0];
        return count > 0;
    }).catch((err) => {
        console.error('verifyUser error:', err);
        return false;
    });
}


// Recipe INSERT (Query 1)
async function insertRecipe(recipeId, cName, timeEstimate, servings, title, instructions) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Recipe (RecipeID, CName, TimeEstimate, Servings, Title, Instructions)
             VALUES (:recipeId, :cName, :timeEstimate, :servings, :title, :instructions)`,
            [recipeId, cName, timeEstimate ?? null, servings ?? null, title ?? null, instructions ?? null],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('insertRecipe FK error:', err.message);
        } else {
            console.error('insertRecipe error:', err);
        }
        return false;
    });
}

async function insertCreates(userName, recId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Creates (UserName, RecID) VALUES (:userName, :recId)`,
            [userName, recId],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('insertCreates FK error:', err.message);
        } else {
            console.error('insertCreates error:', err);
        }
        return false;
    });
}

async function insertSaves(userName, recId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Saves (UserName, RecID) VALUES (:userName, :recId)`,
            [userName, recId],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('insertSaves FK error:', err.message);
        } else {
            console.error('insertSaves error:', err);
        }
        return false;
    });
}

async function deleteSaves(userName, recId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Saves WHERE UserName = :userName AND RecID = :recId`,
            [userName, recId],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        console.error('deleteSaves error:', err);
        return false;
    });
}

// return true if Creates has a row for this user and recipe, false otherwise
async function userCreatedRecipe(userName, recipeId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `SELECT COUNT(*) AS cnt FROM Creates WHERE UserName = :userName AND RecID = :recipeId`,
            [userName, recipeId],
            { autoCommit: true }
        );
        const count = result.rows[0][0];
        return count > 0;
    }).catch((err) => {
        console.error('userCreatedRecipe error:', err);
        return false;
    });
}

async function insertReview(reviewId, recId, userName, rating, reviewComment, reviewDate) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Review (ReviewID, RecID, UserName, Rating, ReviewComment, ReviewDate)
             VALUES (:reviewId, :recId, :userName, :rating, :reviewComment, TO_DATE(:reviewDate, 'YYYY-MM-DD'))`,
            [reviewId, recId, userName, rating, reviewComment ?? null, reviewDate ?? null],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('insertReview FK error:', err.message);
        } else {
            console.error('insertReview error:', err);
        }
        return false;
    });
}

async function insertContainsIng(recId, iName, amount) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO ContainsIng (RecID, IName, Amount) VALUES (:recId, :iName, :amount)`,
            [recId, iName, amount ?? null],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((err) => {
        if (err.errorNum === 2291) {
            console.error('insertContainsIng FK error:', err.message);
        } else {
            console.error('insertContainsIng error:', err);
        }
        return false;
    });
}

async function deleteContainsIng(recId) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM ContainsIng WHERE RecID = :id`,
            [recId],
            { autoCommit: true }
        );

        if (typeof result.rowsAffected === 'number') return result.rowsAffected >= 0;
        return true;
    }).catch((err) => {
        console.error('deleteContainsIng error:', err);
        return false;
    });
}

async function fetchAllIngredients() {
    try {
        return await withOracleDB(async (connection) => {
            const result = await connection.execute('SELECT IName FROM Ingredient');
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchAllIngredients error:', err);
        return [];
    }
}

async function fetchAssociatedOrgsForUser(userName) {
    try {
        if (userName === undefined || userName === null || userName === '') {
            return [];
        }
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT O.OrgName, O.Rating, O.PostalCode, O.Country, O.StreetAddr
                 FROM AssociatedWithOrg A
                 INNER JOIN Organization O ON A.OrgName = O.OrgName
                 WHERE A.UserName = :userName
                 ORDER BY O.OrgName`,
                [userName],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchAssociatedOrgsForUser error:', err);
        return { error: 'invalid query' };
    }
}

async function fetchPositionForUser(userName) {
    try {
        if (userName === undefined || userName === null || userName === '') {
            return [];
        }
        return await withOracleDB(async (connection) => {
            const result = await connection.execute(
                `SELECT Position FROM Professional WHERE UserName = :userName`,
                [userName],
                { autoCommit: true }
            );
            return result.rows || [];
        });
    } catch (err) {
        console.error('fetchPositionForUser error:', err);
        return { error: 'invalid query' };
    }
}


module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    initiateDemotable, 
    insertDemotable, 
    updateNameDemotable, 
    countDemotable,
    insertRecipe,
    insertCreates,
    insertSaves,
    deleteSaves,
    userCreatedRecipe,
    insertReview,
    insertContainsIng,
    deleteContainsIng,
    deleteRecipe,
    updateRecipe,
    selectRecipe,
    projectRecipe,
    projectReview,
    joinRecipe,
    joinSavedRecipes,
    avgRatingByRecipe,
    fetchPopularRecipes,
    fetchTopCuisine,
    fetchIngredients,
    fetchReviews,
    fetchRecipies,
    fetchAssociatedOrgsForUser,
    fetchPositionForUser,
    fetchExpertUser,
    verifyUser
};