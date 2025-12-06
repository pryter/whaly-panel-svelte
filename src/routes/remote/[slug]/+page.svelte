<script lang="ts">
    import whaly from '$lib/assets/whaly.jpeg'
    import Slider from "$lib/components/Slider.svelte";
    import AnimatedIcon from "$lib/components/icons/AnimatedIcon.svelte";
    import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
    import Input from "$lib/components/Input.svelte";
    import Button from "$lib/components/Button.svelte";
    import type {PlaylistInfo, Queue, Track} from "erela.js";
    import {animate} from "motion";
    import {formatTime} from "$lib/utils.ts";
    import Player from "../Player.svelte";
    import {DiscloseEvent} from "$lib/discloseEvent.svelte.ts";
    import {ConnectionStream, getRequester} from "$lib/ConnectionStream.svelte.ts";
    import type {PageProps} from "../../../../.svelte-kit/types/src/routes/remote/[slug]/$types";

    let { data }: PageProps = $props();

    let userSelect = $state<{options: Track[], sessionId: string, type: string, playlist_info: PlaylistInfo | undefined}>()
    let de = new DiscloseEvent({entry: {keyframe: {opacity: 1, display: "flex"}}, exit : {keyframe: {opacity: 0, display: "none"}}})
    let queuePanel = new DiscloseEvent({entry: {keyframe: {width: "426px"}}, exit : {keyframe: {width: "0px"}}})
    let buttonRef = $state<SVGSVGElement | null>(null)
    queuePanel.onStateChange((state) => {
      if (!buttonRef) return
      if (state) {
        animate(buttonRef, {rotate: 180})
      }else{
        animate(buttonRef, {rotate: 0})
      }
    })
    const connection = new ConnectionStream(data.id)

    $effect(() => {
      connection.connect()
    })

    let query = $state<string>("")
    const search = async () => {
      if (!query) return
      const r = await connection.search(query)
      if (r) {
        if (r.status === 200) {
          userSelect = r.data
          de.set(true)
          query = ""
        }
      }
    }

    const confirm = (trackId: string) =>  {
      if (!userSelect) return
      connection.confirm(userSelect.sessionId, trackId).then((res) => {
        if (!res) return
        if (res.status === 200) {
          userSelect = undefined
          de.set(false)
        }
      })

    }
    const dismissSearch = () => {
      de.set(false)
    }


</script>
<style>
    .body {
        @apply bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1];
    }

</style>

<div class="flex flex-row min-h-screen w-full">
    <div class="p-6 flex flex-col items-center justify-center w-full body">
        <div class="w-full max-w-lg">
            <h1 class="text-3xl text-gray-800 font-bold mb-4 text-center">What are you listening to?</h1>
            <Input bind:value={query} name="Search" type="text" class={{wrapper: "bg-white"}}>
                {#snippet action()}
                    <Button clickAction={() => {search()}} class="bg-blue-400 text-white text-sm px-4 space-x-1" text="Search">
                        {#snippet icon()}
                            <svg id="Search-1" class="size-4 -mt-0.5" stroke-width="1" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.6324 3.75C7.39753 3.75 3.96484 7.18268 3.96484 11.4175C3.96484 15.6525 7.39764 19.086 11.6324 19.086C13.631 19.086 15.451 18.3212 16.8158 17.0682C16.8203 17.0635 16.8249 17.0588 16.8295 17.0541C16.8479 17.0357 16.867 17.0185 16.8867 17.0024C18.3723 15.6038 19.2999 13.6189 19.2999 11.4175C19.2999 7.18268 15.8672 3.75 11.6324 3.75ZM18.4196 17.5808C19.8986 15.9526 20.7999 13.7903 20.7999 11.4175C20.7999 6.35426 16.6956 2.25 11.6324 2.25C6.5691 2.25 2.46484 6.35426 2.46484 11.4175C2.46484 16.4807 6.56899 20.586 11.6324 20.586C13.7826 20.586 15.7599 19.8456 17.3233 18.6059L20.2559 21.531C20.5492 21.8235 21.024 21.8229 21.3166 21.5296C21.6091 21.2364 21.6085 20.7615 21.3152 20.469L18.4196 17.5808Z" fill="currentColor"></path>
                            </svg>
                        {/snippet}
                    </Button>
                {/snippet}
            </Input>
        </div>
        <Player initialPos={connection.streamInitialPosition} track={connection.currentTrack} isPlaying={connection.isPlaying}/>
    </div>
    <div bind:this={queuePanel.element} class="bg-white sm:bg-white/80 sm:rounded-none rounded-l-xl w-[0px] fixed top-0 right-0 min-h-screen sm:relative max-w-xs sm:max-w-sm">
        <div class="flex items-center justify-center absolute top-0 -left-8 h-full">
            <div onmousedown={() => {queuePanel.toggle()}} role="button" tabindex="-1" class="cursor-pointer bg-white rounded-lg py-2 shadow-sm">
                <svg bind:this={buttonRef} id="Chevron Left" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 19L8 12L15 5" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </div>
        </div>
        <div class="p-6 overflow-hidden">
            <h2 class="font-semibold text-xl">Queue</h2>
            <div class="flex flex-col space-y-2 mt-4">
                <h3 class="font-medium text-sm text-gray-800">Up next</h3>
                {#if connection.queue.next}
                    <div class="flex items-center space-x-2">
                        <img src={connection.queue.next?.thumbnail} alt="Whaly" class="object-cover rounded-xl size-[40px]"/>
                        <div class="w-full">
                            <div class="flex items-start justify-between w-full">
                                <h2 class="text-[13px] max-w-[200px] truncate">{connection.queue.next?.title}</h2>
                                <AnimatedIcon name="heart" class="size-4" />
                            </div>
                            <div class="">
                                <div class="flex items-center space-x-2">
                                    <div class="flex items-center space-x-1">
                                        <svg id="Clock analog" class="size-4" viewBox="0 0 24 24" fill="none" stroke-width="2.2"  xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21C16.9709 21 21 16.9699 21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M8.2124 14.1953L12 11.9318V7.0426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M12 11.995V12.005M12.8323 12C12.8323 12.4595 12.4597 12.8322 12.0001 12.8322C11.5405 12.8322 11.168 12.4595 11.168 12C11.168 11.5404 11.5405 11.1678 12.0001 11.1678C12.4597 11.1678 12.8323 11.5404 12.8323 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <span class="text-sm ">{formatTime(connection.queue.next?.duration ?? 0)}</span>
                                    </div>
                                    <div class="flex items-center space-x-1 -mt-0.5">
                                        <svg id="user" class="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1465 3.30078C14.8525 3.30078 17.0465 5.49478 17.0465 8.20078C17.0465 10.9068 14.8525 13.1008 12.1465 13.1008C9.44046 13.1008 7.24646 10.9068 7.24646 8.20078C7.24646 5.49478 9.44046 3.30078 12.1465 3.30078Z" fill="#000000"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4466 14H9.94656C7.44656 14 5.34656 16.1 5.34656 18.6V18.9C5.34656 19.9 6.14656 20.7 7.14656 20.7H17.1466C18.1466 20.7 19.0466 20 18.9466 18.9V18.6C19.0466 16.1 16.9466 14 14.4466 14Z" fill="#000000"></path>
                                        </svg>
                                        <span class="text-sm ">{getRequester(connection.queue.next)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <h3 class="text-gray-400 font-medium text-xs">Currently nothing</h3>
                {/if}

                <h3 class="font-medium text-gray-800 mt-4 text-sm">In Queue</h3>
                {#each connection.queue.rest as item}
                    <div class="flex items-center space-x-2">
                        <img src={item.thumbnail} alt="Whaly" class="object-cover rounded-xl size-[40px]"/>
                        <div class="w-full">
                            <div class="flex items-start justify-between w-full">
                                <h2 class="text-[13px] max-w-[200px] truncate">{item.title}</h2>
                                <AnimatedIcon name="heart" class="size-4" />
                            </div>
                            <div class="">
                                <div class="flex items-center space-x-2">
                                    <div class="flex items-center space-x-1">
                                        <svg id="Clock analog" class="size-4" viewBox="0 0 24 24" fill="none" stroke-width="2.2"  xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21C16.9709 21 21 16.9699 21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M8.2124 14.1953L12 11.9318V7.0426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M12 11.995V12.005M12.8323 12C12.8323 12.4595 12.4597 12.8322 12.0001 12.8322C11.5405 12.8322 11.168 12.4595 11.168 12C11.168 11.5404 11.5405 11.1678 12.0001 11.1678C12.4597 11.1678 12.8323 11.5404 12.8323 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <span class="text-sm ">{formatTime(item.duration ?? 0)}</span>
                                    </div>
                                    <div class="flex items-center space-x-1 -mt-0.5">
                                        <svg id="user" class="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1465 3.30078C14.8525 3.30078 17.0465 5.49478 17.0465 8.20078C17.0465 10.9068 14.8525 13.1008 12.1465 13.1008C9.44046 13.1008 7.24646 10.9068 7.24646 8.20078C7.24646 5.49478 9.44046 3.30078 12.1465 3.30078Z" fill="#000000"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4466 14H9.94656C7.44656 14 5.34656 16.1 5.34656 18.6V18.9C5.34656 19.9 6.14656 20.7 7.14656 20.7H17.1466C18.1466 20.7 19.0466 20 18.9466 18.9V18.6C19.0466 16.1 16.9466 14 14.4466 14Z" fill="#000000"></path>
                                        </svg>
                                        <span class="text-sm ">{getRequester(item)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border-b border-gray-200 w-full"/>
                {/each}
            </div>
        </div>
    </div>
    <div  bind:this={de.element} class="fixed hidden opacity-0 items-center justify-center top-0 left-0 min-h-screen  bg-gray-800/30 backdrop-blur-xs w-full p-4">
        <div class="bg-white py-4 px-6 rounded-2xl w-full max-w-md">
            <div class="flex items-center justify-between">
                <h1 class="font-semibold text-lg">Search Result</h1>
                <Button clickAction={dismissSearch} class="p-0 bg-none shadow-none" text="">
                    {#snippet icon()}
                        <svg id="remove circle" class="size-6 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd" d="M12 2.5C6.762 2.5 2.5 6.761 2.5 12C2.5 17.238 6.762 21.5 12 21.5C17.238 21.5 21.5 17.238 21.5 12C21.5 6.761 17.238 2.5 12 2.5Z" fill="currentColor"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.866 14.8638C14.72 15.0098 14.528 15.0838 14.336 15.0838C14.143 15.0838 13.952 15.0098 13.805 14.8638L11.999 13.0568L10.198 14.8578C9.90501 15.1508 9.43001 15.1508 9.13701 14.8578C8.84501 14.5648 8.84501 14.0908 9.13701 13.7978L10.938 11.9968L9.13601 10.1938C8.84301 9.90081 8.84301 9.42681 9.13601 9.13381C9.42901 8.84081 9.90301 8.84081 10.196 9.13381L11.998 10.9358L13.8 9.13481C14.093 8.84181 14.567 8.84181 14.86 9.13481C15.153 9.42681 15.153 9.90181 14.86 10.1948L13.059 11.9968L14.866 13.8028C15.159 14.0958 15.159 14.5708 14.866 14.8638Z" fill="currentColor"></path>
                        </svg>
                    {/snippet}
                </Button>
            </div>
            <p class="text-gray-600 -mt-1">Pick your result here</p>
            <div class="space-y-3 py-4 px-2 overflow-y-auto max-h-[300px]">
                {#each userSelect?.options as option}
                    <div onmousedown={() => {confirm(option.identifier)}} tabindex="-1" role="button"  class="flex items-center space-x-2 cursor-pointer">
                        <img src={option.artworkUrl} alt="sr" class="rounded-xl size-[40px] object-cover"/>
                        <div class="w-full">
                            <div class="flex items-start justify-between w-full">
                                <h2 class="text-[13px] max-w-[200px] truncate">{option.title}</h2>
                                <AnimatedIcon name="heart" class="size-4" />
                            </div>
                            <div class="">
                                <div class="flex items-center space-x-2">
                                    <div class="flex items-center space-x-1">
                                        <svg id="Clock analog" class="size-4" viewBox="0 0 24 24" fill="none" stroke-width="2.2"  xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 21C16.9709 21 21 16.9699 21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M8.2124 14.1953L12 11.9318V7.0426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                            <path d="M12 11.995V12.005M12.8323 12C12.8323 12.4595 12.4597 12.8322 12.0001 12.8322C11.5405 12.8322 11.168 12.4595 11.168 12C11.168 11.5404 11.5405 11.1678 12.0001 11.1678C12.4597 11.1678 12.8323 11.5404 12.8323 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <span class="text-sm ">{formatTime(option.duration ?? 0)}</span>
                                    </div>
                                    <div class="flex items-center space-x-1 -mt-0.5">
                                        <svg id="user" class="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1465 3.30078C14.8525 3.30078 17.0465 5.49478 17.0465 8.20078C17.0465 10.9068 14.8525 13.1008 12.1465 13.1008C9.44046 13.1008 7.24646 10.9068 7.24646 8.20078C7.24646 5.49478 9.44046 3.30078 12.1465 3.30078Z" fill="#000000"></path>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4466 14H9.94656C7.44656 14 5.34656 16.1 5.34656 18.6V18.9C5.34656 19.9 6.14656 20.7 7.14656 20.7H17.1466C18.1466 20.7 19.0466 20 18.9466 18.9V18.6C19.0466 16.1 16.9466 14 14.4466 14Z" fill="#000000"></path>
                                        </svg>
                                        <span class="text-sm ">{option.sourceName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="border-b border-gray-200 w-full"/>
                {/each}
            </div>
        </div>
    </div>
</div>
