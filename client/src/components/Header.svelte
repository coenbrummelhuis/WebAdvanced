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
        height: 8rem;
        background-color: #555555;
        color: white;
    }
    ul {
        display: flex;
        list-style: none;
        justify-content: space-evenly;
        flex-direction: column;
    }
</style>