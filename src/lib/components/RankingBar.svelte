<script lang="ts">
    import {Tween} from "svelte/motion";
    import { cubicOut } from 'svelte/easing';

    const {progress, title, url, index, count} = $props();
    const initialDelay = 1000

    const barWidth = new Tween(0, {		duration:1000,delay: (index * 100 )+ initialDelay,
      easing: cubicOut})

    const diffColor =
      "flex justify-end bg-gradient-to-r rounded-md from-green-200 via-green-400 to-purple-700 h-6 px-2 relative"
    const defaultColor =
      "flex justify-end bg-gradient-to-r rounded-md from-fuchsia-500 via-red-600 to-orange-400 h-6 px-2 relative"

    let dif = $derived(index % 2 === 0)

    $effect(() => {
      barWidth.set(progress)
    })
</script>

<div class="flex space-x-2 mb-4">
    <h1 class="text-xl font-semibold text-gray-100">{index + 1}</h1>
    <div
            style:width={`${barWidth.current}%`}
            class={dif ? defaultColor : diffColor}
    >
        <a
                target="_blank"
                rel="noreferrer"
                href={url}
                class="absolute top-6 inline max-w-[70%] truncate text-xs text-white transition-all"
        >
            {title}
        </a>
        <h1 class="text-sm text-gray-200 sm:text-base">{count}</h1>
    </div>
</div>