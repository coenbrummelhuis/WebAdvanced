<script>
    export let valueType;
    export let inputType;
    export let value;
    export let onKeyUp;

    const type = (inputType === "text" || inputType === "number" || inputType === "email" || inputType === "password") ? inputType : "text";

    const keyUpEvent = (event) => {
        onKeyUp(event);
    }
</script>
<div>
    <input on:keyup={keyUpEvent} on:change={keyUpEvent} bind:value={value} {...{type}} placeholder="{valueType}...">
</div>


<style>
    div {
        text-align: inherit;
    }
    input {
        padding: 1em 2em;
        border-radius: 1em;
        border: 2px solid;
        margin: 0.2rem;
        width: 80%;
    }
</style>