"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detailUser = exports.updateUser = exports.signIn = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
require("dotenv/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const dbConnect_1 = __importDefault(require("../database/dbConnect"));
const schemaUser_1 = require("../validation/schemaUser");
const createUser = async (req, res) => {
    try {
        const { name, email, password } = schemaUser_1.createUserBody.parse(req.body);
        const checkEmailExists = await (0, dbConnect_1.default)("users").where({ email }).first();
        if (checkEmailExists) {
            return res
                .status(400)
                .json({ message: "The email provided already exists" });
        }
        const encryptedPassword = await bcrypt_1.default.hash(password, 10);
        await (0, dbConnect_1.default)("users").insert({
            name,
            email,
            password: encryptedPassword,
            created_at: new Date(),
        });
        return res.status(201).json();
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(500).json({ message: error });
        }
        return res
            .status(500)
            .json({ message: "Failed to create user: " + error.message });
    }
};
exports.createUser = createUser;
const signIn = async (req, res) => {
    try {
        const { email, currentPassword } = schemaUser_1.signInBody.parse(req.body);
        const user = await (0, dbConnect_1.default)("users").where({ email }).first();
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const checkIfPasswordIsCorrect = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!checkIfPasswordIsCorrect) {
            return res
                .status(401)
                .send({ message: "Email and/or password is incorrect" });
        }
        const createTokenData = {
            id: user.id,
            name: user.name,
        };
        const token = jsonwebtoken_1.default.sign(createTokenData, process.env.PASSWORD_JWT, {
            expiresIn: "1h",
        });
        return res.status(200).json({ token });
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(500).json({ message: error });
        }
        return res
            .status(500)
            .json({ message: "Failed when trying to login: " + error.message });
    }
};
exports.signIn = signIn;
const updateUser = async (req, res) => {
    const idUser = req.userData?.id;
    const data = req.body;
    try {
        let { newPassword, currentPassword } = schemaUser_1.editPasswordBody.parse(data);
        let { name, email } = schemaUser_1.editUserBody.parse(data);
        let { avatar } = schemaUser_1.editUserAvatar.parse(data);
        if (avatar) {
            await (0, dbConnect_1.default)("users").update({ avatar }).where({ id: idUser });
            return res.status(200).json();
        }
        if (name || email) {
            if (name) {
                await (0, dbConnect_1.default)("users").update({ name }).where({ id: idUser });
                return res.status(200).json();
            }
            if (email) {
                const checkEmail = await (0, dbConnect_1.default)("users")
                    .whereNot({ id: idUser })
                    .andWhere({ email })
                    .first();
                if (checkEmail) {
                    return res
                        .status(401)
                        .json({ message: "The email provided already exists" });
                }
                await (0, dbConnect_1.default)("users").update({ email }).where({ id: idUser });
            }
        }
        if (newPassword && currentPassword) {
            const userPassword = await (0, dbConnect_1.default)("users")
                .select("password")
                .where({ id: idUser })
                .first();
            const checkPassword = await bcrypt_1.default.compare(currentPassword, userPassword.password);
            if (checkPassword) {
                const encryptedPassword = await bcrypt_1.default.hash(newPassword, 10);
                await (0, dbConnect_1.default)("users")
                    .update({ password: encryptedPassword })
                    .where({ id: idUser });
                return res.status(200).json();
            }
            else {
                return res.status(401).json({
                    message: "Failed when trying to update password: Unauthorized",
                });
            }
        }
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            return res.status(401).json(error.errors);
        }
        return res
            .status(500)
            .json({ message: "Failed when trying to update user: " + error.message });
    }
};
exports.updateUser = updateUser;
const detailUser = async (req, res) => {
    const idUser = req.userData?.id;
    try {
        const user = await (0, dbConnect_1.default)("users").where({ id: idUser }).first();
        const { password, ...dataUser } = user;
        return res.status(200).json(dataUser);
    }
    catch (error) {
        return res
            .status(500)
            .json({ message: "Failed to trying to detail user: " + error.message });
    }
};
exports.detailUser = detailUser;
