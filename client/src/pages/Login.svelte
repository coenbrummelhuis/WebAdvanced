<script>
    import { onMount } from 'svelte';
    import user from "../stores/user.js";
    const filter = () => {
        console.log("filter")
    }
    export let params;
</script>
<input type="text" class="search" id="search" on:keyup={filter}
       placeholder="Search...">