<script>
    export let account;
</script>
<nav>
    <section>
        <ul>
            <li><h1 id="title">Title</h1></li>
            <li><p id="subtitle">Subtitle</p></li>
        </ul>
    </section>
    <aside>
        {#if account == null}
            <p>Login</p>
        {:else }
            <p>Test</p>
        {/if}
    </aside>
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #555555;
        color: white;
        height: 8rem;
        padding: 0.5rem;
    }
    ul {
        display: flex;
        list-style: none;
        justify-content: space-evenly;
        flex-direction: column;
    }
    h1,p {
        text-decoration: none;
        font-weight: bolder;
        font-size: larger;
        padding: 0.5rem;
        color: white;
        align-items: flex-start;
    }
</style>