import page from "page";

export async function getAllAuctionItems() {
        const response = await fetch("http://localhost:3000/books", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        const data = await response.json();
        const status = response.status;
        if (status !== 200) {
            throw new Error(data.message);
        } else {
            return data;
        }
}

export async function getAuctionItemById(id) {
    if (id === undefined || isNaN(id)) {
        page.redirect("/")
    }
    const response = await fetch(`http://localhost:3000/books/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error("Item not found");
    }
}

export async function getFilteredAuctionItems(filter) {
    let filterURL = "";
    for (const filterName in filter) {
        if (filter[filterName] !== "" && filter[filterName] !== -1) {
            filterURL += "&" + filterName + "=" + filter[filterName];
        }
    }
    const response = await fetch("http://localhost:3000/books?" + filterURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    const data = await response.json();
    const status = response.status;
    if (status !== 200) {
        throw new Error(data.message);
    } else {
        return data;
    }
}
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
        return {
            winningBids: getWinningBids(user, data.message),
            wonBids: getWonBids(user, data.message)
        };
    } else {
        throw new Error(data.message);
    }
}

export async function placeBid(id, user, newBid) {
    if (id === undefined || isNaN(id)) {
        page.redirect("/")
    }
    const response = await fetch(`http://localhost:3000/books/${id}/bids`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + user.token
        },
        body: JSON.stringify({price: newBid})
    });
    if (response.ok) {
        return await response.json();
    } else {
        let data = await response.json();
        throw new Error(data.message);
    }
}

export function getFormattedTimeBetween(dateFrom, dateTo) {
    const {days, hours, minutes, seconds} = getTimeBetweenDates(dateFrom, dateTo)
    if (seconds < 0 || isNaN(seconds) || seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0) {
        return "Auction ended!";
    }
    switch (true) {
        case days > 0:
            return days + " day(s) " + hours + " hour(s)";
        case hours > 0:
            return hours + " hour(s) " + minutes + " minute(s)";
        default:
            return minutes + " minute(s) " + seconds + " second(s)";
    }
}

function getTimeBetweenDates(dateFrom, dateTo) {
   const difference = new Date(dateTo).getTime() - new Date(dateFrom).getTime();
   const days = Math.floor(difference / (1000 * 60 * 60 * 24));
   const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
   const minutes = Math.floor((difference / (1000 * 60) % 60));
   const seconds = Math.floor((difference / 1000) % 60);
    return {days, hours, minutes, seconds};
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