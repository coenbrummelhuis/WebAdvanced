<script>
    import page from "page";
    import userStore from "../stores/user.js"
    import {onMount} from "svelte";
    import {hasAdminRole} from "../js/auth-controller.js";
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import {editAuctionItem, getAuctionItemById} from "../js/item-controller.js";

    let user = $userStore;

    let notice = false;
    let noticeMessage = "";

    let newItem = {
        "title": "",
        "description": "",
        "launchDate": "",
        "language": "",
        "author": "",
        "bidders": [],
        "img": [],
        "price": 0,
        "auction-date": ""
    }

    onMount(async () => {
        if (!hasAdminRole(user)) {
            page.redirect("/");
        }
        const oldItem = await getAuctionItemById(params.id);
        const launchDate = new Date(oldItem.launchDate);
        const auctionDate = new Date(oldItem["auction-date"]);
        newItem = {
            "id": oldItem.id,
            "title": oldItem.title,
            "description": oldItem.description,
            "launchDate": `${launchDate.getFullYear()}-${launchDate.getMonth() + 1}-${launchDate.getDate()}`,
            "language": oldItem.language,
            "author": oldItem.author,
            "bidders": oldItem.bidders,
            "img": oldItem.img,
            "price": oldItem.price,
            "auction-date": `${auctionDate.getFullYear()}-${auctionDate.getMonth() + 1}-${auctionDate.getDate()}`
        }
    });

    const editBook = async () => {
        notice = false;
        noticeMessage = "";
        try {
            const result = await editAuctionItem(params.id, newItem, user);
            page.redirect(`/items/${result.id}`);
        } catch (e) {
            notice = true;
            noticeMessage = e.message;
            document.body.scrollIntoView();
        }
    }

    export let params;
</script>
<main>
    <h1>Add item</h1>
    <p>Fill in the form to add an item to the auction</p>
    <p class:invisible={!notice} id="notice">{noticeMessage}</p>
    <form>
        <label for="title">Title</label>
        <TextBox valueType="Title" inputType="text" bind:value={newItem.title} onKeyUp={() => ""}></TextBox>
        <label for="description">Description</label>
        <TextBox valueType="Description" inputType="text" bind:value={newItem.description} onKeyUp={() => ""}></TextBox>
        <label for="price">Price</label>
        <TextBox valueType="Price" inputType="number" bind:value={newItem.price} onKeyUp={() => ""}></TextBox>
        <label for="launchDate">Launch date</label>
        <TextBox valueType="Launch date YYYY-MM-DD" inputType="text" bind:value={newItem.launchDate} onKeyUp={() => ""}></TextBox>
        <label for="language">Language</label>
        <TextBox valueType="Language" inputType="text" bind:value={newItem.language} onKeyUp={() => ""}></TextBox>
        <label for="author">Author</label>
        <TextBox valueType="Author" inputType="text" bind:value={newItem.author} onKeyUp={() => ""}></TextBox>
        <label for="auctionDate">Auction date</label>
        <TextBox valueType="Auction date YYYY-MM-DD" inputType="text" bind:value={newItem["auction-date"]}
                 onKeyUp={() => ""}></TextBox>
        <Button text="Add item" click={editBook}></Button>
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

    .invisible {
        visibility: hidden;
    }

    #notice {
        color: darkred;
        margin: 0;
    }

    input, textarea {
        width: 80%;
    }

    button {
        width: 80%;
    }
</style>