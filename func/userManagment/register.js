import { getFileContent } from "../fileEditing/getFileContent.js";
import { saveFile } from "../fileEditing/saveFile.js";
import { userExists } from "./userExists.js";

export async function register(username, password, passwordConfirm) {
  if (await userExists(username)) {
    return "Username alredy taken!!";
  }
  if (password !== passwordConfirm) {
    return "Passwords do not match!!";
  }

  const users = JSON.parse(await getFileContent("../data/users.json"));
  users.push({ username, password });
  await saveFile("../data/users.json", JSON.stringify(users));
  return "ok";
}
