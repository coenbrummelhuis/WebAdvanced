<script>
    import filtersStore from "../stores/filter.js";
    import DropDownMenu from "./DropDownMenu.svelte";
    import TextBox from "./TextBox.svelte";
    import DoubleSlider from "./DoubleSlider.svelte";
    // import {getAuctionItems} from "../pages/Home.svelte";
    let filters = $filtersStore;
    export let items;
    export let refresh;

    const getLanguageDropdownItems = async () => {
        const awaitItems = await items;
        let uniqueLanguagues = new Set();
        awaitItems.map(item => item.language).forEach(language => {
            let firstChar = language.charAt(0);
            firstChar = firstChar.toUpperCase();
            language = language.slice(1);
            language = firstChar + language;
            uniqueLanguagues.add(language)
        });
        return uniqueLanguagues;
    }
    let languageItems = getLanguageDropdownItems();

    const getMaxPrice = async () => {
        const awaitItems = await items;
        return Math.max(...awaitItems.map(item => item.price));
    }
    let maxPrice = getMaxPrice();


</script>
<section>
    <h1>Filters</h1>
    <p><b>Language</b></p>
    <DropDownMenu menuItems={languageItems} bind:value={filters.language} onChange={refresh}></DropDownMenu>
    <p><b>Author</b></p>
    <TextBox type="Author" bind:value={filters.author} onKeyUp={refresh}></TextBox>
    <p><b>Price</b></p>
    {#await maxPrice}
        <h1>Waiting for response from backend</h1>
    {:then price}
        <DoubleSlider valueFrom={filters.priceFrom} valueTo={filters.priceTo} min=0 max={price}
                      onInput={refresh}></DoubleSlider>
    {/await}
</section>

<style>
    section {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        margin-left: 1rem;
    }

    p {
        margin-bottom: 0.5rem;
    }
</style>