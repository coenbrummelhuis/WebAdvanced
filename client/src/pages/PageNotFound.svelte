<script>
    export let params;
</script>
<section>
    <a href="/">
        <h1>Page: {params.pathname} not found!</h1>
        <h2>Please navigate to home!</h2>
    </a>

</section>
<style>
    section {
        display: inline-flex;
        list-style: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 3rem;
        padding: 2rem;
        border-radius: 2em;
    }
    * {
        font-size: x-large;
    }
    a {
        text-decoration: none;
        padding: 0.5rem;
        margin: 0;
        color: black;
        font-size: smaller;
        text-align: start;
    }
</style>
