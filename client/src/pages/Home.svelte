<script>
    import AuctionList from "../components/AuctionList.svelte";
    import Filters from "../components/Filters.svelte";
    import TextBox from "../components/TextBox.svelte";
    import filtersStore from "../stores/filter.js"

    let filters = $filtersStore

    const search = async (ignored) => {
        items = await getAuctionItems();
    }

    export const getAuctionItems = async () => {
        let filterURL = "";
        for (const filter in filters) {
            console.log(filter)
            if (filters[filter] !== "" && filters[filter] !== -1) {
                filterURL += "&" + filter + "=" + filters[filter];
            }
            console.log(filterURL)
        }
        const response = await fetch("http://localhost:3000/books?" + filterURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        const data = await response.json();
        const status = response.status;
        if (status !== 200) {
            throw new Error(data.message);
        }else {
            return data;
        }
    }

    let items = getAuctionItems();

    export let params;
</script>
<main>
    <aside>
        <Filters bind:items refresh={search}></Filters>
    </aside>
    <section>
        <h1>Search</h1>
        <TextBox type="Search" bind:value={filters["title"]} onKeyUp={search}></TextBox>
        <AuctionList bind:filters={filters} bind:items ></AuctionList>
    </section>
</main>

<style>
    h1 {
        width: 80%;
        text-align: start;
        margin-left: 3em;
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
        max-width: 200px;/* Sidebar always in the first column */
    }
    section {
        min-width: 100%; /* Main content always in the second column */
    }
    @media screen and (max-width: 800px) {
        main {
            grid-template-columns: 1fr; /* Only one column */
        }
        aside {
            max-width: 100%; /* Sidebar always in the first column */
        }
        h1 {
            margin-left: 0;
            text-align: center;
            min-width: 100%;
        }

    }
</style>