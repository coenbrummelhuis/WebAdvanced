<script>
    import user from "../stores/user.js";
    const src = "./src/assets/book_white.png"

    export let active
</script>
<nav>
    <a href="/">
    <section class="titles">
        <img {src} alt="Logo">
        <section>
            <ul>
                <li><h1 id="title">BidBook</h1></li>
                <li><p id="subtitle">The site to find used books!</p></li>
            </ul>
        </section>

    </section>
    </a>
    <aside>
        {#if $user.token === undefined}
            <a class:active={active === "/login"} href="/login">Login</a>
            <a class:active={active === "/register"} href="/register">Register</a>
        {:else }
            <a href="/account">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 1200 1200">
                    <path fill="currentColor"
                          d="M605.096 480c-135.542-2.098-239.082-111.058-239.999-240C367.336 105.667 477.133.942 605.096 0c135.662 5.13 239.036 108.97 240.001 240c-2.668 134.439-111.907 239.09-240.001 240m194.043 49.788c170.592 1.991 257.094 151.63 257.881 301.269V1200H889.784l.001-324.254c-4.072-22.416-19.255-30.018-33.164-27.82c-13.022 2.059-24.929 12.701-25.56 27.82V1200h-464.67V875.746c-3.557-21.334-17.128-29.537-30.331-28.709c-14.138.889-27.853 12.135-28.393 28.709V1200h-164.68V831.057c-.98-159.475 99.901-300.087 259.137-301.269z"/>
                </svg>
            </a>

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
    }

    section {
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: center;
    }

    aside {
        padding-right: 5rem;
    }

    ul {
        display: flex;
        padding: 1rem;
        list-style: none;
        justify-content: space-evenly;
        flex-direction: column;
    }

    h1, p, a {
        text-decoration: none;
        padding: 0.5rem;
        margin: 0;
        color: white;
        text-align: start;
    }

    .active {
        font-weight: bolder;
    }

    img {
        min-height: 20px;
        max-height: 20vh;
        height: 4rem;
        padding: 0.5rem;
    }

    @media screen and (max-width: 500px){
        .titles {
            display: none;
        }
        nav{
            justify-content: center;
        }
        aside {
            padding: 0;
        }
    }
</style>