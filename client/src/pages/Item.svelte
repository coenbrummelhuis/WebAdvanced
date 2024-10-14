<script>
    import page from "page";
    import {onMount} from "svelte";
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import userStore from "../stores/user.js"
    import Bidder from "../components/Bidder.svelte";
    import { hasBidderRole } from "../js/auth-controller.js";

    let user = $userStore;

    let notice = false;
    let noticeMessage = "Test";

    export let params;

    let auctionEnded = false;
    let currentDateTime = new Date();
    let newBid = 0;

    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date();
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    });


    const getItem = async () => {
        const id = params.id;
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
            const data = await response.json();
            newBid = parseInt(data.price) + 1;
            return data;
        } else {
            throw new Error("Item not found");
        }
    }

    let item = getItem();

    $: isBidder = hasBidderRole(user);

    const sendNewBid = async () => {
        notice = false;
        noticeMessage = "";
        const id = params.id;
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
            item = await getItem();
            return await response.json();
        } else {
            notice = true;
            console.log(response)
            let data = await response.json();
            noticeMessage = data.message;
        }
    }

    $: getTime = (endDate) => {
        const diff = endDate - currentDateTime.getTime();
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (diff < 0 || isNaN(diff)) {
            auctionEnded = true;
            return "Auction ended!";
        }
        if (days > 0) {
            return days + " day(s) " + hours + " hour(s)";
        } else if (hours > 0) {
            return hours + " hour(s) " + minutes + " minute(s)";
        } else {
            return minutes + " minute(s) " + seconds + " second(s)";
        }
        return (minutes - hours * 60) + " minute(s) " + (seconds - minutes * 60) + " second(s)";
    }


</script>
<main>
    {#await item}
        <p>Loading...</p>
    {:then data}
        <aside>
            <picture>
                <img id="mainPicture" width="150rem" src={data.img[0]} alt="Main cover image"></picture>
            <aside class="thumbImages">
                {#each data.img as img}
                    <picture>
                        <img width="75rem" src={img} alt="Picture of book cover"></picture>
                {/each}
            </aside>
        </aside>
        <section>
            <h1>{data.title}</h1>

            <p>Launchdate: <i>{data.launchDate}</i></p>
            <p>Author: <i>{data.author}</i></p>
            <p>Price: <i>€{(data.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</i></p>

            <p>Description:</p>
            <p><i>{data.description}</i></p>
        </section>
        <aside>
            <p>Current bid: <i>€{(data.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</i></p>
            <p>End date: <i>{new Date(data["auction-date"]).toLocaleString()}</i></p>
            <p>Time left: <i>{getTime(new Date(data["auction-date"]).getTime())}</i></p>
            <p><b>Bids</b></p>
            {#if data.bidders.length === 0}
                <p>No bids yet!</p>
            {:else}
                {#each data.bidders as bidder}
                    <Bidder username={bidder.bidder} price={bidder.price}></Bidder>
                {/each}
            {/if}
            {#if isBidder}
                {#if auctionEnded}
                    <p><b>Auction ended!</b></p>
                {:else}
                    <p><b>New bid:</b></p>
                    <TextBox valueType="bid" inputType="number" bind:value={newBid} onKeyUp={() => ""}></TextBox>
                    <p class="notice" class:invisible={!notice}>{noticeMessage}</p>
                    <Button text="Bid" click={async () => await sendNewBid()}></Button>
                {/if}
            {:else}
                <p><b>You must be logged in to bid!</b></p>
            {/if}

        </aside>
    {:catch e}
        <a href="/">
            <p>Item not found!</p>
            <p>Please go back to the homepage</p>
        </a>
    {/await}
</main>

<style>
    main > aside, main > section {
        display: flex;
        background-color: #D9D9D9;
        padding: 1rem;
        margin: 1rem;
        border-radius: 1em;
    }

    section {
        flex-direction: column;
        text-align: left;
    }

    aside {
        flex-direction: column;
    }

    #mainPicture {
        margin: 2rem auto;
    }

    .thumbImages {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(75px, 1fr));
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }

    .notice {
        color: red;
        margin: 0;
    }

    .invisible {
        visibility: hidden;
    }

    h1 {
        width: 80%;
    }

    p {
        margin: 0 0 1rem;
    }


    main {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        padding: 0;
        margin: 2rem;
    }
</style>