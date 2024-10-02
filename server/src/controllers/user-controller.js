export function createUser(req, res) {
    const body = req.body;
    if (validEmail(body["email"] && validPassword(body["password"])));
}

function validEmail(email) {
    if(email == null) {
        return false;
    }
    if (!email.includes("@")) {
        return false;
    }
    const first = email.split("@")[0];
    const provider = email.split("@")[1]
    if(!provider.includes(".")) {
        return false;
    }
    return true;
}
function validPassword(password) {
    if (password == null) {
        return false;
    }
    return true;
}