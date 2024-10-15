import page from "page";

export async function loginUser(username, password, user) {
    if (!validEmail(username)) {
        throw new Error("Email is not a valid email!");
    }
    if (password === null) {
        throw new Error("Password can't be empty!")
    }
    validPassword(password)
    const response = await fetch("http://localhost:3000/auth", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    const data = await response.json();
    const status = response.status;
    if (status === 200) {
        user.token = data.token;
    } else {
        throw new Error(data.message);
    }
}

export async function registerUser(username, password, repeatedPassword, user) {
    if (!validEmail(username)) {
        throw new Error("Email is not a valid email!");
    }
    validPassword(password);
    if (password !== repeatedPassword) {
        throw new Error("Password does not equal repeated password");
    }

    const response = await fetch("http://localhost:3000/users", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });
    const data = await response.json();
    const status = response.status;
    if (status === 201) {
        user.token = data.token;
    } else {
        throw new Error(data.message);
    }
}

export async function logoutUser(user) {
    const response = await fetch("http://localhost:3000/auth", {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + user.token
        }
    });
    const status = response.status;
    if (status === 204) {
        user.token = undefined;
        page.redirect("/");
    }
    user.token = undefined;
    page.redirect("/");
}

function validEmail(email) {
    if (email == null) {
        throw new Error("Email can't be empty!");
    }
    if (!email.includes("@")) {
        return false;
    }

    const provider = email.split("@")[1];
    if (!provider.includes(".")) {
        return false;
    }
    return true;
}

function validPassword(password) {
    if (password === null) {
        throw new Error("Password can't be empty!")
    }
    if (password.length < 8) {
        throw new Error("Password should have a length of at least 8");
    }
    if (!password.match(/[a-z]/)) {
        throw new Error("Password should have at least one lowercase letter!");
    }
    if (!password.match(/[A-Z]/)) {
        throw new Error("Password should have at least one uppercase letter!");
    }
    if (!password.match(/\d/)) {
        throw new Error("Password should have at least one number!");
    }
}