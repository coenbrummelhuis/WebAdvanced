<script>
    import {getFormattedTimeBetween} from "../js/item-controller.js";
    import {onDestroy, onMount} from "svelte";

    let currentDateTime = new Date();
    let interval;
    onMount(() => {
        const interval = setInterval(() => {
            currentDateTime = new Date();
        }, 1000);
        return () => clearInterval(interval);
    });
    onDestroy(() => clearInterval(interval));
    $: getTime = (endDate) => getFormattedTimeBetween(currentDateTime, endDate);
    $: itemPriceWithDecimals = (price) => price.toLocaleString(undefined, {minimumFractionDigits: 2});

    export let item;
</script>
<li>
    <a href="/items/{item.id}">
        <article>
            {#if (item.img.length !== 0)}
                <picture><img width="150rem" src={item.img[0]} alt="First book cover"></picture>
            {:else }
                <picture><img width="150rem" src="https://dummyimage.com/200x300/" alt="Placeholder"></picture>
            {/if}
            <h1>{item.title}</h1>
            <h3>{getTime(item["auction-date"])}</h3>
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
