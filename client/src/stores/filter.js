import {writable} from "svelte/store";

export default writable({
    "title": "",
    "language": "",
    "author": "",
     "priceFrom": -1,
    "priceTo" : -1
})