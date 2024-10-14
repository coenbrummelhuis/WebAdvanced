export async function getBidsOfUser(user) {
    const userToken = user.token;
    const payload = atob(user.token.split('.')[1]);
    if (payload === undefined) {
       throw new Error("Invalid token");
    }
    const userId = JSON.parse(payload)["userId"];
    const response = await fetch(`http://localhost:3000/users/${userId}/bids`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + user.token
        }
    });
    const data = await response.json();
    const status = response.status;
    if (status === 200) {
        let result = {
            winningBids: getWinningBids(user, data.message),
            wonBids: getWonBids(user, data.message)
        };
        console.log(result)
        return result;
    } else {
        throw new Error(data.message);
    }
}

function getAllBids(user, bids) {
    const allBids = [];
    for (const bid of bids) {
        if(bid.bidders.length === 0) {
            return;
        }
        if (bid.bidders[bid.bidders.length - 1].userId === user.userId) {
            allBids.push(bid);
        }
    }
    allBids.sort((a, b) => new Date(a["auction-date"]) - new Date(b["auction-date"]));
    return allBids
}

function getWinningBids(user, bids) {
    const allBids = getAllBids(user, bids);
    return allBids.filter(bid => new Date(bid["auction-date"]).getTime() > new Date().getTime());
}

function getWonBids(user, bids) {
    const allBids = getAllBids(user, bids);
    return allBids.filter(bid => new Date(bid["auction-date"]).getTime() <= new Date().getTime());
}