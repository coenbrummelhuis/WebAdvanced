<script>
    import {onMount} from "svelte";

    onMount(() => {
    });
    $: getTime = (today, endDate) => {
        const diff = endDate - today;
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (diff < 0 || isNaN(diff)) {
            return "Auction ended!";
        }
        if (days > 0) {
            return days + " day(s) " + hours + " hour(s)";
        } else if (hours > 0) {
            return hours + " hour(s) " + minutes + " minute(s)";
        }else {
            return minutes + " minute(s) " + seconds + " second(s)";
        }
    }

    $: itemPriceWithDecimals = (price) => {
        return price.toLocaleString(undefined, {minimumFractionDigits: 2});
    }
    export let item;
</script>
<li>
    <a href="/items/{item.id}">
        <article>
            {#if (item.img.length !== 0)}
                <picture><img width="150rem" src={item.img[0]} alt="Picture of book cover"></picture>
                {:else }
                <picture><img width="150rem" src="https://via.placeholder.com/200" alt="Placeholder image"></picture>
                {/if}
            <h1>{item.title}</h1>
            <h3>{getTime(new Date().getTime(), new Date(item["auction-date"]).getTime())}</h3>
            <h3>€{itemPriceWithDecimals(parseInt(item.price))}</h3>
        </article>
    </a>
</li>
<style>
    li {
        display: flex;
        flex: 1 0 25%;
        background-color: #D9D9D9;
        padding: 1rem;
        margin: 1rem;
        width: max(200px, 90%);
        border-radius: 2em;
        justify-content: center;
        text-align: center;
    }
    a {
        text-decoration: none;
        color: black;
    }
</style>
