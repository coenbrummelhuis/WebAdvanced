<script>
    import AuctionListItem from "./AuctionListItem.svelte";

    export let filters;

    export let items;
</script>
<ul>
    {#each items as auctionItem}
        <AuctionListItem bind:item={auctionItem}></AuctionListItem>
    {/each}
</ul>


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