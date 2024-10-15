<script>
    import page from "page";
    import userStore from "../stores/user.js"
    import {onMount} from "svelte";
    import {hasAdminRole} from "../js/auth-controller.js";
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    let user = $userStore;

    let title;
    let description;
    let launchDate;
    let language;
    let author;
    let img;
    let price;
    let auctionDate;



    onMount(() => {
        if(!hasAdminRole(user)) {
            page.redirect("/");
        }
    });

    export let params;
</script>
<main>
    <h1>Add item</h1>
    <p>Fill in the form to add an item to the auction</p>
    <form>
        <label for="title">Title</label>
        <TextBox valueType="Title" inputType="text" bind:value={title} onKeyUp={() => ""}></TextBox>
        <label for="description">Description</label>
        <TextBox valueType="Description" inputType="text" bind:value={description} onKeyUp={() => ""}></TextBox>
        <label for="price">Price</label>
        <TextBox valueType="Price" inputType="number" bind:value={price} onKeyUp={() => ""}></TextBox>
        <label for="launchDate">Launch date</label>
        <TextBox valueType="Launch date" inputType="text" bind:value={launchDate} onKeyUp={() => ""}></TextBox>
        <label for="language">Language</label>
        <TextBox valueType="Language" inputType="text" bind:value={language} onKeyUp={() => ""}></TextBox>
        <label for="author">Author</label>
        <TextBox valueType="Author" inputType="text" bind:value={author} onKeyUp={() => ""}></TextBox>
        <label for="img">Image src</label>
        <TextBox valueType="Image" inputType="text" bind:value={img} onKeyUp={() => ""}></TextBox>
        <label for="auctionDate">Auction date</label>
        <TextBox valueType="Auction date" inputType="text" bind:value={auctionDate} onKeyUp={() => ""}></TextBox>
        <Button text="Add item" click={() => ""}></Button>
    </form>
</main>
<style>
    main {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        align-items: center;
        gap: 1em;
        margin: 1em;
    }

    form {
        display: grid;
        grid-template-columns: 1fr;
        justify-items: center;
        text-align: center;
        gap: 1em;
    }

    label {
        font-weight: bold;
    }

    input, textarea {
        width: 80%;
    }

    button {
        width: 80%;
    }
</style>