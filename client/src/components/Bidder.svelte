<script>
    export let username;
    export let price;
</script>
<p>{username}: <i>€{price}</i></p>
<style>
    p {
        padding: 1em 2em;
        background: white;
        border-radius: 1em;
        border: 2px solid;
        margin: 0.2rem;
    }

    i {
        font-style: normal;
    }
</style>