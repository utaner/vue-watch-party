<template>
    <div v-if="active" class="contextMenu">
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

        }
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
  