<script>
    import userStore from "../stores/user.js";
    let user = $userStore;
    import TextBox from "../components/TextBox.svelte";
    import Button from "../components/Button.svelte";
    import { loginUser} from "../js/user-controller.js";
    import page from "page";
    let email;
    let password;
    let notice = false;
    let noticeMessage = "";
    let login = async () => {
        notice = false;
        try {
            await loginUser(email, password, user);
            page.redirect("/")
        } catch (e) {
            notice = true;
            noticeMessage = e.message;
        }
    }
    export let params;
</script>
<section>
    <h1>Log in</h1>
    <TextBox valueType="E-mail" inputType="text" bind:value={email} onKeyUp={async (e) => {(e.key === "Enter") ? await login() : ""}}></TextBox>
    <TextBox valueType="Password" inputType="password" bind:value={password} onKeyUp={async (e) => {(e.key === "Enter") ? await login() : ""}}></TextBox>
    <p class:invisible={!notice}>{noticeMessage}</p>
    <Button text="Login" click={async () => await login()}></Button>
    <a href="/register">Don't have an account? Register </a>
</section>
<style>
    h1 {
        margin: 1rem;
        font-size: xx-large;
    }
    section {
        display: inline-flex;
        list-style: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin: 3rem;
        padding: 2rem;
        background-color: #D9D9D9;
        border-radius: 2em;
        width: max(25%, 300px);
    }
    p {
        margin: 0;
        color: darkred;
        font-size: small;
    }
    .invisible {
        visibility: hidden;
    }

    a {
        text-decoration: none;
        padding: 0.5rem;
        margin: 0;
        color: black;
        font-size: smaller;
        text-align: start;
    }
</style>
