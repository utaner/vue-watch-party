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


        //event profileIcon
        const body = await readBody<changeUserRequestBody | null>(event);
        if (!body) {
            return createError({ statusCode: 400, statusMessage: "Bad request." });
        }
        const { profileIcon } = body;
        if (profileIcon) {
            getUser.profileIcon = profileIcon;
            getUser.save();
        }




    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Something went wrong.",
        });
    }
});
