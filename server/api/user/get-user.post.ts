import { SignInRequestBody } from "../../../types/user";
import userModel from "../../models/user.model";

export default defineEventHandler(async (event) => {
    try {
        const auth = getCookie(event, "auth");
        if (!auth) {
            return createError({ statusCode: 401, statusMessage: "Unauthorized." });
        }

        //fetch user data
        const getUser = await userModel.findOne({ token: auth });
        if (!getUser) {
            return createError({ statusCode: 401, statusMessage: "Unauthorized." });
        }

        const userObj = {
            username: getUser.username,
            email: getUser.email,
            profileIcon: getUser.profileIcon,
        };
        return userObj;

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Something went wrong.",
        });
    }
});
