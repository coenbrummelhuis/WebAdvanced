<script>
    import AuctionListItem from "./AuctionListItem.svelte";

    export let filters;

    export let items;
</script>
{#await items}
    <h1>Waiting for response from backend</h1>
{:then list}
    <ul>
        {#each list as auctionItem}
            <AuctionListItem bind:item={auctionItem}></AuctionListItem>
        {/each}
    </ul>

{:catch ignored}
    <h1>No connection to the backend can be established</h1>
{/await}

<style>
    ul {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 30%));
        justify-content: space-evenly;
        gap: 2rem;
        list-style: none;
        padding: 0;
        margin: 2rem;
    }
</style>