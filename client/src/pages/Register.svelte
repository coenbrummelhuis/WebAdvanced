<script>
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    let email;
    let password;
    let repeatedPassword;
    let notice = true;
    let onClick = () => {
        notice = !notice
        console.log(email);
        console.log(password)
        console.log(repeatedPassword)
    }
    const filter = () => {
        console.log("filter")
    }
    export let params;
</script>
<section>
    <article>
        <h1>Register</h1>
        <TextBox type="E-mail" bind:value={email}></TextBox>
        <TextBox type="Password" bind:value={password}></TextBox>
        <TextBox type="Repeat password" bind:value={repeatedPassword}></TextBox>
        <p class:invisible={notice}>Email or password is incorrect!</p>
        <Button text="Register" click={onClick}></Button>
        <a href="/register">Already have an account? Log in</a>
    </article>
    <aside>
        <h1>BidBook</h1>
        <ul>
            <li>Join our community of book enthusiasts and collectors</li>
            <li>Explore a wide range of genres and authors in our extensive catalog</li>
            <li>Find the perfect addition to your personal library.</li>
        </ul>
    </aside>
</section>

<style>
    article {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 2rem 2rem 2rem 2rem;
        padding: 2rem;
        background-color: #D9D9D9;
        border-radius: 2em;
        min-width: 25%;
    }
    aside {
        margin-right: 6rem;
        width: 20%;
    }
    section {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: row-reverse;
        margin: 2rem;
    }
    h1 {
        font-size: xx-large;
    }
    ul {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: start;
        list-style: none;
        padding: 0
    }
    li {
        padding: 0.5rem;
        align-items: center;
    }
    a {
        text-decoration: none;
        padding: 0.5rem;
        margin: 0;
        color: black;
        font-size: smaller;
        text-align: start;
    }
    p {
        margin: 0;
        color: darkred;
        font-size: small;
    }
    .invisible {
        visibility: hidden;
    }
</style>
