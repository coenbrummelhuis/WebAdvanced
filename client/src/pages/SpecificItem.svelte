<script>
    import {onDestroy, onMount} from "svelte";
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import userStore from "../stores/user.js"
    import Bidder from "../components/Bidder.svelte";
    import {getAuctionItemById, getFormattedTimeBetween, placeBid} from "../js/item-controller.js";
    import {hasBidderRole, hasAdminRole} from "../js/auth-controller.js";
    import AdminItemHeader from "../components/AdminItemHeader.svelte";

    export let params;

    const sendNewBid = async () => {
        notice = false;
        noticeMessage = "";
        try {
            await placeBid(params.id, user, newBid);
        } catch (e) {
            notice = true;
            noticeMessage = e.message;
        }
    };

    let user = $userStore;

    let notice = false;
    let noticeMessage = "Test";

    let auctionEnded = false;
    let currentDateTime = new Date();

    let item;
    let newBid;

    let interval;
    let eventSource

    onMount(async () => {
        item = await getAuctionItemById(params.id);
        eventSource = new EventSource(`http://localhost:3000/books/${params.id}/monitor/${item.monitorID}`);
        eventSource.addEventListener("message", event => {
            const data = JSON.parse(event.data);
            for (const key in data) {
                item[key] = data[key];
            }
            newBid = item.price + 1;
        })
        eventSource.addEventListener("error", event => {
            // when the server side closes the socket, it causes an error on the client side
            // by default, the client will try to reconnect after an error
            console.error("sse error", event)
            // closing the event source on the client side prevents the reconnect attempt
            eventSource.close()
        })

        interval = setInterval(() => {
            currentDateTime = new Date();
        }, 1000);
    });
    onDestroy(() => {
        clearInterval(interval)
        eventSource.close();
    })


    const getItem = async () => {
        item = await getAuctionItemById(params.id);
        newBid = item.price + 1;
    }

    $: isBidder = hasBidderRole(user);
    $: getTime = (endDate) => getFormattedTimeBetween(currentDateTime, endDate);
</script>
<AdminItemHeader active={hasAdminRole(user) } notice={[notice, noticeMessage]} {params}></AdminItemHeader>
<main>
    {#await getItem()} }
        <p>Loading...</p>
    {:then _}
        <aside>
            <picture>
                <img id="mainPicture" width="150rem" src={item.img[0]} alt="Main cover image"></picture>
            <aside class="thumbImages">
                {#each item.img as img}
                    <picture>
                        <img width="75rem" src={img} alt="Picture of book cover"></picture>
                {/each}
            </aside>
        </aside>
        <section>
            <h1>{item.title}</h1>

            <p>Launchdate: <i>{new Date(item.launchDate).toLocaleDateString()}</i></p>
            <p>Author: <i>{item.author}</i></p>
            <p>Price: <i>€{(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</i></p>

            <p>Description:</p>
            <p><i>{item.description}</i></p>
        </section>
        <aside>
            <p>Current bid: <i>€{(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</i></p>
            <p>End date: <i>{new Date(item["auction-date"]).toLocaleString()}</i></p>
            <p>Time left: <i>{getTime(new Date(item["auction-date"]).getTime())}</i></p>
            <p><b>Bids</b></p>
            {#if item.bidders.length === 0}
                <p>No bids yet!</p>
            {:else}
                {#each item.bidders as bidder}
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
        margin: 0 1rem 1rem;
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