<script>
    export let type;
    export let filters;

    const getAuctionItems = async () => {

    }

    let actualType = (type === "ul" || type === "ol") ? type : "ul";

</script>
{#await getAuctionItems()}

{:then list}

{:catch error}

{/await}