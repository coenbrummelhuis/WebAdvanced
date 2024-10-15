import page from "page";

export async function addNewAuctionItem(item, user) {
    await checkItemValidity(item);
    const response = await fetch("http://localhost:3000/books", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + user.token
        },
        body: JSON.stringify(item)
    });
    const data = await response.json();
    const status = response.status;
    if (status !== 201) {
        throw new Error(data.message);
    } else {
        return data;
    }
}

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

async function checkItemValidity(item) {
    if (item.title === undefined || item.title === "") {
        throw new Error("Title is required");
    }
    if (item.description === undefined || item.description === "") {
        throw new Error("Description is required");
    }
    if (item.price === undefined || item.price === "") {
        throw new Error("Price is required");
    }
    if (isNaN(parseInt(item.price))) {
        throw new Error("Price is not a number");
    }
    item.price = parseInt(item.price);
    if (parseInt(item.price) !== parseFloat(item.price)) {
        throw new Error("Price is not a whole number");
    }
    if (parseInt(item.price) < 0) {
        throw new Error("Price can't be negative");
    }
    if (item.launchDate === undefined || item.launchDate === "") {
        throw new Error("Launch date is required");
    }
    if (Date.parse(item.launchDate) === undefined || isNaN(Date.parse(item.launchDate))) {
        throw new Error("Launch date is in incorrect format (YYYY-MM-DD)");
    }
    if (item.language === undefined || item.language === "") {
        throw new Error("Language is required");
    }
    if (item.author === undefined || item.author === "") {
        throw new Error("Author is required");
    }
    if (item.img === undefined || item.img === "") {
        throw new Error("Image is required");
    }

    const resp = await fetch(item.img[0], { method: 'HEAD' });
    if(resp.status !== 200) {
        item.img[0] = "https://dummyimage.com/200x300/";
    }

    if (item["auction-date"] === undefined || item["auction-date"] === "") {
        throw new Error("Auction date is required");
    }
    if (Date.parse(item["auction-date"]) === undefined || isNaN(Date.parse(item["auction-date"]))) {
        throw new Error("Auction date is in incorrect format (YYYY-MM-DD)");
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