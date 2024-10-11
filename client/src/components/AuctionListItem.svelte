<script>
    import {onMount} from "svelte";

    onMount(() => {
    });
    const getTime = (today, endDate) => {
        const diff = endDate - today;
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        if (diff < 0 || isNaN(diff)) {
            return "Auction ended!";
        }
        if (days > 0) {
            return days + " day(s)";
        } else if (hours > 0) {
            return hours + " hour(s)"
        }else {
            return hours + " hour(s) " + (minutes - hours * 60) + " minute(s)"
        }

    }
    export let item;
</script>
<li>
    <a href="/items/{item.id}">
        <article>
            <picture><img width="150rem" src="https://i.pinimg.com/736x/a0/69/7a/a0697af2de64d67cf6dbb2a13dbc0457.jpg"
                          alt="Picture of book cover"></picture>
            <h1>{item.title}</h1>
            <h3>{getTime(new Date().getTime(), new Date(item["auction-date"]).getTime())}</h3>
            <h3>€{(item.price).toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
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
        width: max(200px, 30%);
        border-radius: 2em;
        justify-content: center;
        text-align: center;
    }
</style>
