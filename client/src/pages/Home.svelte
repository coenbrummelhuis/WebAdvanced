<script>
    import AuctionList from "../components/AuctionList.svelte";
    import Filters from "../components/Filters.svelte";
    let filters = [];
    export let params;
</script>
<aside>
    <Filters bind:filters={filters}></Filters>
</aside>
<section>
    <AuctionList bind:filters={filters}></AuctionList>
</section>
