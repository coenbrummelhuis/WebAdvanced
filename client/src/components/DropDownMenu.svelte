<script>
    import DropDownMenuItem from "./DropDownMenuItem.svelte";

    export let value;
    export let menuItems;
    export let onChange;

</script>
<section>
    <select bind:value={value} on:change={onChange()}>
        <DropDownMenuItem value="" text="All"></DropDownMenuItem>
        {#each menuItems as item}
            <DropDownMenuItem value={item} text={item}></DropDownMenuItem>
        {/each}
    </select>
</section>

<style>
    select {
        padding: 1em 2em;
        border-radius: 1em;
        border: 2px solid;
        margin: 0.2rem;
        display: inline-flex;
        list-style: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>