<script>
    import filtersStore from "../stores/filter.js";
    import DropDownMenu from "./DropDownMenu.svelte";
    import TextBox from "./TextBox.svelte";
    import DoubleSlider from "./DoubleSlider.svelte";

    let filters = $filtersStore;
    export let items;
    export let refresh;

    let languageItems = new Set(items.map(item => item.language).map(language => {
        let firstChar = language.charAt(0);
        firstChar = firstChar.toUpperCase();
        language = language.slice(1);
        return firstChar + language;
    }))

    const getMaxPrice = async () => {
        return Math.max(...items.map(item => item.price));
    }
    let maxPrice = getMaxPrice();


</script>
<section>
    <h1>Filters</h1>
    <p><b>Language</b></p>
    <DropDownMenu menuItems={languageItems} bind:value={filters.language} onChange={refresh}></DropDownMenu>
    <p><b>Author</b></p>
    <TextBox valueType="Author" inputType="text" bind:value={filters.author} onKeyUp={refresh}></TextBox>
    <p><b>Price</b></p>
    {#await maxPrice}
        <h1>Waiting for response from backend</h1>
    {:then price}
        <DoubleSlider bind:valueFrom={filters.priceFrom} bind:valueTo={filters.priceTo} min=0 max={price}
                      onInput={refresh}></DoubleSlider>
    {/await}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: inherit;
        align-items: inherit;
        margin-left: 1rem;
    }

    p {
        margin-bottom: 0.5rem;
        text-align: inherit;
    }
</style>