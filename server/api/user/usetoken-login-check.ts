import { SignInRequestBody } from "../../../types/user";
import userModel from "../../models/user.model";

export default defineEventHandler(async (event) => {
  try {
    //get token from cookie
    const auth = getCookie(event, "auth");
    if (!auth) {
      return createError({ statusCode: 401, statusMessage: "Unauthorized." });
    }

    //fetch user data
    const getUser = await userModel.findOne({ token: auth }).select("+password");
    if (!getUser) {
      //remove cookie
      deleteCookie(event, "auth");
      return createError({ statusCode: 401, statusMessage: "Unauthorized." });
    }
    return 200;
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: "Something went wrong.",
    });
  }
});
