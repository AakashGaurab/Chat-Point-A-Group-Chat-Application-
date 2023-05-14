const express = require("express");
const admin = express.Router();
const UserModel = require("../Models/user_model");

/**
 * @swagger
 * /admin/read:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users from the database
 *     tags:
 *       - Admin
 *     responses:
 *       '200':
 *         description: A list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *       '404':
 *         description: Error retrieving users
 */
admin.get("/read", async (req, res) => {
    try {
        let data = await UserModel.find({});
        res.json(data);
    } catch (error) {
        res.status(404).send(error);
    }
})

/**
 * @swagger
 * /admin/create:
 *   post:
 *     summary: Create a new admin.
 *     description: Creates a new admin user with the provided name, email, and password.
 *     tags:
 *       - Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success message after creating the admin.
 *       404:
 *         description: Error message if there is an issue inserting the admin into the database.
 */
admin.post("/create", async (req, res) => {
    let payload = req.body;
    let { name, email, password } = payload;
    bcrypt.hash(password, process.env.salt, async (err, hash) => {
        if (err) {
            res.send("Error Hashing Password");
        }
        else {
            try {
                await UserModel.insertMany([{ name, email, password: hash, role: "Admin" }])
                res.send("Admin Added Succesfully");
            } catch (error) {
                res.status(404).send(error);
            }
        }
    })
})

/**
 * @swagger
 * /admin/update:
 *   put:
 *     summary: Update user role to admin
 *     tags: 
 *       - Admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User email
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
admin.put("/update", async (req, res) => {
    let { email } = req.body;
    try {
        await UserModel.updateOne({ email: email }, { $set: { role: "Admin" } });
        res.send("User Updated To admin");

    } catch (error) {
        res.status(404).send(error);
    }
})

/**
 * @swagger
 * /admin/delete:
 *   delete:
 *     summary: Delete a user by email address
 *     tags: [Admin]
 *     description: Deletes a user from the database.
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The email address of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: Error deleting user
 */
admin.delete("/delete", async (req, res) => {
    try {
        await UserModel.deleteOne({ email: email });
        res.send("User Removed from Data Base");
    } catch (error) {
        res.status(404).send("Error deleting user")
    }
})

module.exports = { admin };
