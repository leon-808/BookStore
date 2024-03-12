import express from "express";
import {
  joinNewUser,
  patchUserPasswordResetRequest,
  proceedLogin,
  resetUserPassword,
  verifyPasswordResetToken,
} from "../controllers/users.controller";
import { errorWrapper } from "../middlewares/common/errorWrapper.middeware";
const UsersRoute = express.Router();
UsersRoute.use(express.json());

UsersRoute.post("/", errorWrapper(joinNewUser));
UsersRoute.patch("/reset", errorWrapper(patchUserPasswordResetRequest));
UsersRoute.post("/reset", errorWrapper(verifyPasswordResetToken));
UsersRoute.put("/reset", errorWrapper(resetUserPassword));
UsersRoute.post("/login", errorWrapper(proceedLogin));

export default UsersRoute;
