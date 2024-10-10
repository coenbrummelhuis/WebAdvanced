<script>
    import {onMount} from "svelte";

    onMount(() => {
        console.log(item)
    });
    const getTime = (endDate, startDate) => {
        const seconds = Math.floor((endDate - startDate) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        console.log(hours)
        if (isNaN(seconds)) {
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
        flex: 1 0 140px;
        background-color: #D9D9D9;
        padding: 0.5rem;
        border-radius: 2em;
    }
</style>
