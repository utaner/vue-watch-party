import { SignInRequestBody } from "../../../types/user";
import userModel from "../../models/user.model";

export default defineEventHandler(async (event) => {
    try {
        deleteCookie(event, "auth");

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: "Something went wrong.",
        });
    }
});
