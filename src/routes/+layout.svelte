<script lang="ts">
    import '../app.css';
    import favicon from '$lib/assets/favicon.svg';
    import '@fontsource-variable/nunito';
    import '@fontsource-variable/noto-sans-thai';
    import {initializeFirebase} from "$lib/firebase.client.ts";

    let { children } = $props();
    $effect(() => {
      initializeFirebase()
    })

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
