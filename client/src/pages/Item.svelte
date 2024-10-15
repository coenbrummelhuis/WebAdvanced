<script>
    import {onDestroy, onMount} from "svelte";
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import userStore from "../stores/user.js"
    import Bidder from "../components/Bidder.svelte";
    import {getAuctionItemById, getFormattedTimeBetween, placeBid} from "../js/item-controller.js";
    import {hasBidderRole} from "../js/auth-controller.js";

    export let params;

    let user = $userStore;

    let notice = false;
    let noticeMessage = "Test";

    let auctionEnded = false;
    let currentDateTime = new Date();
    let interval;
    let newBid = 0;

    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date();
        }, 1000);
        return () => clearInterval(interval)
    });

    onDestroy(() => clearInterval(interval));


    const getItem = async () => {
        const tempItem = await getAuctionItemById(params.id);
        newBid = tempItem.price + 1;
        return tempItem;
    }

    const sendNewBid = async () => {
        notice = false;
        noticeMessage = "";
        try {
            item = await placeBid(params.id, user, newBid);
        } catch (e) {
            notice = true;
            noticeMessage = e.message;
        }
    }

    let item = getItem();
    $: isBidder = hasBidderRole(user);
    $: getTime = (endDate) => getFormattedTimeBetween(currentDateTime, endDate);
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
        <p>{e}</p>
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