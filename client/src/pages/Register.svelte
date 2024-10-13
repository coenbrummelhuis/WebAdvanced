<script>
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import userStore from "../stores/user.js";
    import {registerUser} from "../js/user-controller.js";
    import page from "page";
    let user = $userStore;
    let email;
    let password;
    let repeatedPassword;
    let notice = false;
    let noticeMessage = "";
    const register = async () => {
        notice = false;
        try {
            await registerUser(email, password, repeatedPassword, user);
            page.redirect("/")
        } catch (e) {
            notice = true;
            noticeMessage = e.message;
        }
    }
    export let params;
</script>
<section>
    <article>
        <h1>Register</h1>
        <TextBox valueType="E-mail" inputType="text" bind:value={email} onKeyUp={async (e) => {(e.key === "Enter") ? await register() : ""}}></TextBox>
        <TextBox valueType="Password" inputType="password" bind:value={password} onKeyUp={async (e) => {(e.key === "Enter") ? await register() : ""}}></TextBox>
        <TextBox valueType="Repeat password" inputType="password" bind:value={repeatedPassword} onKeyUp={async (e) => {(e.key === "Enter") ? await register() : ""}}></TextBox>
        <p class:invisible={!notice}>{noticeMessage}</p>
        <Button text="Register" click={register}></Button>
        <a href="/login">Already have an account? Log in</a>
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
        min-width: max(25%, 300px);
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
        margin: 1rem;
    }
    h1 {
        margin: 1rem;
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
    @media screen and (max-width: 800px) {
        aside {
            display: none;
        }

    }
</style>
