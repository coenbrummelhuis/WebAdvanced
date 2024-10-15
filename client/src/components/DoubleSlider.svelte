<script>
    import {onMount} from "svelte";
    import TextBox from "./TextBox.svelte";

    export let valueFrom;
    export let valueTo;
    export let min;
    export let max;


    onMount(() => {
        min = parseInt(min);
        max = parseInt(max);
        valueFrom = min
        valueTo = max;
    })


    function controlFromSlider() {
        if (valueFrom < min) {
            valueFrom = min;
        }
        if (valueFrom >= max) {
            valueFrom = max - 1;
        }
        if (valueFrom >= valueTo) {
            valueFrom = valueTo - 1;
        }
        onInput();
    }

    function controlToSlider() {
        if (valueTo <= min) {
            valueTo = min + 1;
        }
        if (valueTo > max) {
            valueTo = max;
        }
        if (valueFrom >= valueTo) {
            valueTo = valueFrom + 1;
        }
        onInput();
    }

    export let onInput;
</script>
<div class="sliders_control">
    <!--        When creating a slider, make sure to bind first and onInput later-->
    <input id="fromSlider"
           bind:value={valueFrom} type="range" min={min}
           on:input={() => {controlFromSlider()}}
           on:change={() => {controlFromSlider()}}
           step="1"
           max={max}/>
    <input id="toSlider"
           bind:value={valueTo} type="range" min={min}
           style="--fromValueDivRange: {(valueFrom / (max - min)) * 100}%; --toValueDivRange: {(valueTo / (max - min)) * 100}%;"
           on:input={() => controlToSlider()}
           on:change={() => {controlToSlider()}}
           step="1"
           max={max}/>
</div>
<div class="input_control">
    <p>From</p>
    <TextBox valueType="" inputType="number" bind:value={valueFrom} onKeyUp={controlFromSlider}></TextBox>
    <p>To</p>
    <TextBox valueType="" inputType="number" bind:value={valueTo} onKeyUp={controlToSlider}></TextBox>
</div>

<style>
    div {
        display: grid;
        grid-template-columns: 1fr;
        justify-content: center;
        justify-items: center;
        align-items: center;
        text-align: center;
    }

    p {
        margin: 0 0 0 0.5rem;
    }

    input[type=range] {
        -webkit-appearance: none;
        appearance: none;
        margin: 18px 0;
        width: 80%;
    }

    #fromSlider, #toSlider {
        grid-column: 1;
        grid-row: 1;
    }

    #fromSlider {
        height: 0;
        z-index: 2;
    }

    #toSlider {
        z-index: 1;
        height: 5px;
        border-radius: 1em;
        background: linear-gradient(
                to right,
                #C6C6C6 0%,
                #C6C6C6 var(--fromValueDivRange),
                #25daa5 var(--fromValueDivRange),
                #25daa5 var(--toValueDivRange),
                #C6C6C6 var(--toValueDivRange),
                #C6C6C6 100%
        );
    }
</style>