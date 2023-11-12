<template>
    <div class="member" @mouseover="show(user._id)" @mouseleave="hide">
        <ContextMenu :active="menuActive" :user="user"> <!-- user bilgilerini de prop olarak yolla -->
            <div class="userInfo">
                <span>{{ user.username }}</span>
                <span class="time">{{ time }}</span>

            </div>
        </ContextMenu>
        <img :src="'/_nuxt/public/assets/image/profile/' + user.avatar + '.jpg'" />
    </div>
</template>

<script lang="ts">
export default {
    props: {
        room: {
            type: Object,
            required: true,
        },
        user: {
            type: Object,
            required: true,
        }

    },
    data() {
        return {
            menuActive: false,
            time: '00:00:00'
        }
    },


    methods: {
        show(userID: string) {
            this.menuActive = true;

            this.$socket.emit('getTimeUser', { userID: userID });

        },
        hide(element: any) {
            this.menuActive = false;
        },
    },
    mounted() {
        this.$socket.on('getTimeResponse', (data: any) => {

            let time = data.time;
            let hour = Math.floor(time / 3600);
            let minute = Math.floor((time - hour * 3600) / 60);
            let second = Math.floor(time - hour * 3600 - minute * 60);

            let hourStr = hour < 10 ? '0' + hour : hour;
            let minuteStr = minute < 10 ? '0' + minute : minute;
            let secondStr = second < 10 ? '0' + second : second;

            this.time = hourStr + ':' + minuteStr + ':' + secondStr;


        });
    }
}
</script>