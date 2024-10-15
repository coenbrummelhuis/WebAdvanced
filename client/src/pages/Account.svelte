<script>
    import page from "page";
    import Button from "../components/Button.svelte";
    import AuctionListItem from "../components/AuctionListItem.svelte";
    import userStore from "../stores/user.js";

    import {logoutUser} from "../js/user-controller.js";
    import {onMount} from "svelte";
    import {isUserLoggedIn} from "../js/auth-controller.js";
    import {getBidsOfUser} from "../js/item-controller.js";

    const user = $userStore;

    onMount(() => {
        if (!isUserLoggedIn(user)) {
            page.redirect("/login");
        }
    });

    export let params;
</script>
<main>
    <h1>Account</h1>
    <Button text="Log out" click={() => logoutUser(user)}>
    </Button>

    <section>
        <h1>Winning and won bids</h1>
        {#await getBidsOfUser(user)}
            <p>Loading...</p>
        {:then allBids}
            <p><b>Winning bids</b></p>
            {#if allBids.winningBids.length === 0}
                <p>No winning bids</p>
            {:else}
                <ul>
                    {#each allBids.winningBids as bid}
                        <AuctionListItem item={bid}></AuctionListItem>
                    {/each}
                </ul>
            {/if}
            <p><b>Won bids</b></p>
            {#if allBids.wonBids.length === 0}
                <p>No won bids</p>
            {:else}
                <ul>
                    {#each allBids.wonBids as bid}
                        <AuctionListItem item={bid}></AuctionListItem>
                    {/each}

                </ul>
            {/if}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </section>
</main>
<style>
    ul {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 30%));
        justify-content: space-evenly;
        gap: 2rem;
        list-style: none;
        padding: 0;
        margin: 2rem;
    }

</style>