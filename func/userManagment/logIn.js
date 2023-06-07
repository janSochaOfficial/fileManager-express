import { userExists } from "./userExists.js";
import { getFileContent } from "../fileEditing/getFileContent.js";



export async function logIn(username, password){
    if(!(await userExists(username))){
        return "User does not exist!"
    }
    const users = JSON.parse(await getFileContent("../data/users.json"));
    const isPasswordCorrect = users.filter((user) => {
        return user.username == username && user.password == password;
    }).length > 0;

    if(isPasswordCorrect){
        return "ok"
    }
    return "Wrong password!"
} 