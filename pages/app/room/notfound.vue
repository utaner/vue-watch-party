<template>
    <div class="container">
        <div class="content">
            <div class="notfound">
                <div class="notfound-404">
                    <h1>404</h1>
                </div>
                <h2>Oda Bağlantısı Geçersiz veya Süresi Doldu</h2>
                <p>
                    Aradığınız odayı bulamadık. Odanın bağlantısı geçersiz veya süresi dolmuş olabilir.
                </p>
                <a href="/app" class="btn btn-primary">Ana Sayfaya Dön</a>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
definePageMeta({
    layout: "login",
});
</script>