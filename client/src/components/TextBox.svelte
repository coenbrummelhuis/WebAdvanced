<script>
    export let type;
    export let value;
    export let onKeyUp;

    const keyUpEvent = (event) => {
        onKeyUp(event);
    }
</script>

<input on:keyup={keyUpEvent} bind:value={value} type="text" placeholder="{type}...">

<style>
    input {
        padding: 1em 2em;
        border-radius: 1em;
        border: 2px solid;
        margin: 0.2rem;
        width: 80%;
    }
</style>