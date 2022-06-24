import { checkBannedUserList, con } from "../../models/queryModel";
import { userList, userInfo } from "../../models/types";

export async function loginBanCheck(req: any, res: any, next: any) {
  try {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    }
    const idx = userList.findIndex(
      (user: userInfo) => user.access === req.session.passport.user.access
    );
    if (idx === -1) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    }
    const isBanned = await checkBannedUserList(req.session.passport.user.user_id);
    if (isBanned === 1) {
      res.status(400).send({ error: "Permission Denied" });
      return;
    };
  } catch(err) {
    console.log(err);
    throw(err);
  };
  
  next();
}

export default function authCheck(req: any, res: any, next: any) {
  if (req.user) {
    console.log("success auth");
    next();
  } else {
    console.log("failed to auth");
    res.status(401).json({
      authenticated: false,
      message: "User has not been authenticated",
    });
  }
}
