<script>
    import AuctionList from "../components/AuctionList.svelte";
    import Filters from "../components/Filters.svelte";
    import TextBox from "../components/TextBox.svelte";
    import filtersStore from "../stores/filter.js"
    import userStore from "../stores/user.js";
    import { getAllAuctionItems, getFilteredAuctionItems} from "../js/item-controller.js";
    import {onDestroy, onMount} from "svelte";
    import AdminHomeHeader from "../components/AdminHomeHeader.svelte";
    import {hasAdminRole} from "../js/auth-controller.js";

    let filters = $filtersStore
    let user = $userStore;

    onMount(() => {
        search();
    });

    const search = async () => {
        allItems = await getAllAuctionItems();
        filteredItems = await getFilteredAuctionItems(filters);
    }

    $: hasAdmin = () => hasAdminRole(user)

    let filteredItems = getFilteredAuctionItems(filters);
    let allItems = getAllAuctionItems();

    export let params;
</script>
<main>
    {#await allItems}
        <h1>Waiting for response from backend</h1>
    {:then allItems}
        {#await filteredItems}
            <h1>Waiting for response from backend</h1>
        {:then auctionItems}
            <aside>
                <Filters items={allItems} refresh={search}></Filters>
            </aside>
            <section>
                <AdminHomeHeader active={hasAdmin()}></AdminHomeHeader>
                <h1 id="search">Search</h1>
                <TextBox valueType="Search" inputType="text" bind:value={filters["title"]} onKeyUp={search}></TextBox>
                <AuctionList items={auctionItems}></AuctionList>
            </section>
        {:catch ignored}
            <h1>No connection to the backend can be established</h1>
        {/await}
    {:catch ignored}
        <h1>No connection to the backend can be established</h1>
    {/await}
</main>

<style>
    h1 {
        width: 80%;
        text-align: start;
        margin-left: 3em;
    }

    #search {
        margin-top: 0;
    }

    main {
        display: grid;
        grid-template-columns: 1fr 5fr; /* Sidebar min 200px, content 3 times the remaining space */
        gap: 1rem;
        padding: 0;
        margin: 2rem;
        justify-content: center;
    }

    aside {
        max-width: 200px; /* Sidebar always in the first column */
        text-align: left;
    }

    section {
        min-width: 100%; /* Main content always in the second column */
    }

    @media screen and (max-width: 800px) {
        main {
            grid-template-columns: 1fr; /* Only one column */
        }

        aside {
            max-width: 100%;
            text-align: center; /* Sidebar always in the first column */
        }

        h1 {
            margin-left: 0;
            text-align: center;
            min-width: 100%;
        }

        section {
            text-align: center;
            justify-items: center;
        }

    }
</style>