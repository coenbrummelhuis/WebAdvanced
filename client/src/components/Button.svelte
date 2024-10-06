<script>
    export let text;
    export let click;
</script>

<input value={text} type="button" on:click={click}>

<style>
    input {
        padding: 1em 2em;
        border-radius: 1em;
        margin: 0.5rem;
        background-color: hsl(210,77%,46%);
        color: white;
    }
    input:hover {
        background-color: hsl(210,77%,36%);
    }
</style>