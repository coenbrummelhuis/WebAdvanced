<script>
    export let valueFrom;
    export let valueTo;
    export let onInput;
</script>
<div class="range_container">
    <div class="sliders_control">
        <input id="fromSlider" type="range" value="10" min="0" max="100"/>
        <input id="toSlider" type="range" value="40" min="0" max="100"/>
    </div>
</div>