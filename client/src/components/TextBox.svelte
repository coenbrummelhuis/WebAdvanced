<script>
    export let type;
    export let value;
</script>

<input bind:value={value} type="text" placeholder="{type}...">

<style>
    input {
        padding: 1em 2em;
        border-radius: 1em;
        border: 2px solid;
        margin: 0.2rem;
        width: max-content;
    }
</style>