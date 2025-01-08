<template>
    <div v-if="active" class="contextMenu" :style="extraStyle">
        <div class="contextMenuContainer">

            <div class="contextMenuContent">
                <slot></slot>
            </div>
        </div>
        <div class="ArrowDownOutline">
        </div>
        <div class="ArrowDown">

        </div>
    </div>
</template>
<script lang="ts">
import "@/components/context-menu/ContextMenu.scss";
import { ref } from "vue";


export default {
    name: "ContextMenu",
    props: {
        active: {
            type: Boolean,
            default: false,

        },
        extraStyle: {
            type: String,
            default: "",
        },
    },
    methods: {
        show() {

            //active


        },
        hide(element: any) {
        },

    },

};


</script>
  