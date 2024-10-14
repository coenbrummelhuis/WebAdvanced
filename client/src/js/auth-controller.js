export  function hasBidderRole(user) {
    if (isUserLoggedIn(user) === false) {
        return false;
    }
    const payload = atob(user.token.split('.')[1]);
    if (payload === undefined) {
        return false;
    }
    const roles = JSON.parse(payload)["roles"];
    if (roles === undefined) {
        return false;
    }
    if (roles.includes('bidder')) {
        return true;
    }
}

export function isUserLoggedIn(user) {
    return user.token !== undefined;
}