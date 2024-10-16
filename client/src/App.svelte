<script>
    import router from 'page';

    import Home from "./pages/Home.svelte";
    import Header from "./components/Header.svelte";
    import Login from "./pages/Login.svelte";
    import Register from "./pages/Register.svelte";
    import PageNotFound from "./pages/PageNotFound.svelte";
    import Items from "./pages/SpecificItem.svelte";
    import Account from "./pages/Account.svelte";
    import AddItem from "./pages/AddItem.svelte";
    import EditItem from "./pages/EditItem.svelte";

    let page;
    let params;
    let currentRoute;

    router('/', (ctx) => {
        page = Home;
        currentRoute = ctx.pathname;
    });

    router('/add-item', (ctx) => {
        page = AddItem;
        currentRoute = ctx.pathname;
        params = ctx;
    });
    router('/login', (ctx) => {
        page = Login;
        currentRoute = ctx.pathname;
        params = ctx;
    })
    router('/register', (ctx) => {
        page = Register;
        currentRoute = ctx.pathname;
        params = ctx;
    });
    router('/items/:id', (ctx, next) => {
        params = ctx.params;
        currentRoute = ctx.pathname
        next()
    }, () => {
        page = Items;
    });
    router('/items/:id/edit', (ctx, next) => {
        params = ctx.params;
        currentRoute = ctx.pathname
        next()
    }, () => {
        page = EditItem;
    });
    router('/account', (ctx) => {
        page = Account;
        currentRoute = ctx.pathname;
        params = ctx;
    })
    router('/*', (ctx) => {
        page = PageNotFound;
        currentRoute = ctx.pathname;
        params = ctx;
    })

    router.start();
</script>

<main>
    <Header active={currentRoute}/>
    <svelte:component this={page} {params}/>
</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 0;
        margin: 0;
    }

</style>
