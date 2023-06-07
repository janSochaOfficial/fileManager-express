import { getFileContent } from "../fileEditing/getFileContent.js";


export async function userExists(username) {
    const users = JSON.parse(await getFileContent("../data/users.json"));
    return users.filter((user) => {
        return user.username == username
    }).length > 0
}