<script lang="ts">
    import whaly from '$lib/assets/whaly.jpeg'
    import Button from "$lib/components/Button.svelte";
    import Discord from "$lib/components/icons/Discord.svelte";
    import AnimatedIcon from "$lib/components/icons/AnimatedIcon.svelte";
    import {fly} from "svelte/transition";
    import {cubicOut} from "svelte/easing";
</script>
<div class="flex h-screen flex-col items-center justify-center bg-gradient-to-tr from-gray-700 via-gray-800 to-gray-900 overflow-hidden">
    <div class="flex flex-col items-center w-full relative">
        <img in:fly={{duration: 1000, y: -400, delay: 0, easing: cubicOut}}
             out:fly={{duration: 1000, y: -400, delay: 0, easing: cubicOut}}
             src={whaly} alt="Whaly Logo" class="size-[128px] rounded-full border-white border-4 shadow-md" />
        <h1 in:fly={{duration: 900, y: -400,  delay: 100, easing: cubicOut}}
            out:fly={{duration: 900, y: -400,  delay: 100, easing: cubicOut}} class="text-white text-2xl font-bold mt-4">Whaly</h1>
        <p in:fly={{duration: 800, y: -300,  delay: 200, easing: cubicOut}}
           out:fly={{duration: 800, y: -300,  delay: 200, easing: cubicOut}} class="rounded-lg bg-white px-4 text-gray-600 mt-2">
            A lonely ginger cat.
        </p>
        <div in:fly={{duration: 700, y: -280,  delay: 300, easing: cubicOut}}
             out:fly={{duration: 700, y: -280,  delay: 300, easing: cubicOut}} class="mt-6 w-full max-w-[256px] space-y-2">
            <Button type="a" href="https://google.com" target="_blank" text="Adopt one now" class="w-full h-[46px] bg-gradient-to-r from-cyan-500 via-sky-600 to-gray-700 text-center">
                {#snippet icon(bcfn)}
                    <AnimatedIcon name="gift" bindController={bcfn} class="size-[28px] text-white"/>
                {/snippet}
            </Button>
            <Button text="Visit our discord" class="w-full h-[46px] bg-gradient-to-r from-teal-600 via-emerald-600 to-gray-700">
                {#snippet icon()}
                    <Discord />
                {/snippet}
            </Button>
        </div>
        <a in:fly={{duration: 600, y: 200,  delay: 400, easing: cubicOut}}
           out:fly={{duration: 600, y: 200,  delay: 400, easing: cubicOut}} href="/ranking" class="absolute -bottom-24 flex animate-bounce cursor-pointer flex-col items-center text-gray-100">
          <span class="animate-pulse text-base">
            What&apos;s everyone listening to?
          </span>
            <div class="animate-pulse">
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        width="20px"
                        height="20px"
                        stroke-width={2.2}
                        stroke="currentColor"
                        class="size-5 animate-bounce"
                >
                    <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                </svg>
            </div>
        </a>
    </div>
</div>