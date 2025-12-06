<script>
    import Input from "$lib/components/Input.svelte";
    const {component, propsInfo} = $props();
</script>

<div>
    <div class="flex space-x-2">
        {#each propsInfo as p}
            <pre class="bg-gray-100 rounded-full px-2 py-1 text-xs"><b>{p[0]}</b>="{p[1]}"</pre>
        {/each}
    </div>
    <div class="mt-4 w-full">
        {@render component()}
    </div>
</div>