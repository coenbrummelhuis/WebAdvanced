<script>
    import AuctionListItem from "./AuctionListItem.svelte";

    export let filters;

    const getAuctionItems = async () => {
        let filterURL = "";
        for (const filterQuery in filters) {
            filterURL += "&" + filterQuery["key"] + "=" + filterQuery["value"];
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
        }else {
            return data;
        }
    }
</script>
{#await getAuctionItems()}
    <h1>Waiting for response from backend</h1>
{:then list}
    <ul>
        {#each list as auctionItem}
            <AuctionListItem item={auctionItem}></AuctionListItem>
        {/each}
    </ul>

{:catch ignored}
    <h1>No connection to the backend can be established</h1>
{/await}

<style>
    ul {
        display: flex;
        flex-wrap: wrap;
        gap: 2rem;
        list-style: none;
        padding: 0;
        margin: 2rem;
    }
</style>