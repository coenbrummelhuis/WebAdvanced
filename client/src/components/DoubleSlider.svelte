<script>
    export let valueFrom;
    export let valueTo;
    export let min;
    export let max;



    export let onInput;
</script>
<div class="range_container">
    <div class="sliders_control">
        <input id="fromSlider" bind:value={valueFrom} type="range" min={min} max={max}/>
        <input id="toSlider" bind:value={valueTo} type="range" min={min} max={max}/>
    </div>
</div>

<style>
    .sliders_control {
        display: grid;
        align-items: center;
    }

    #fromSlider, #toSlider {
        grid-column: 1;
        grid-row: 1;
    }

    #fromSlider {
            height: 0;
        z-index: 1;
    }

</style>