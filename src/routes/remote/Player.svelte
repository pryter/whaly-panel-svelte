<script lang="ts">
  import type {Track, UnresolvedTrack} from "erela.js";
    import {formatTime} from "$lib/utils.ts";
    import whaly from "$lib/assets/whaly.jpeg"
    import HeartIcon from "$lib/components/icons/HeartIcon.svelte";
    import Slider from "$lib/components/Slider.svelte";
  import {getRequester} from "$lib/ConnectionStream.svelte.ts";

    const {track, initialPos, isPlaying}:PlayerProps = $props();

    type PlayerProps = {
      track: Track | UnresolvedTrack |  null
      initialPos: number,
      isPlaying: boolean
    }

    type DisplayableTrackData = {
      thumbUrl: string | null
      title: string
      duration: number
      parsedDuration: string
      requester: string
    }


    let displayTrackData: DisplayableTrackData = $derived.by(() => {
      if (isPlaying && track) {
        return {
          thumbUrl: track.thumbnail ?? null,
          title: track.title,
          duration: track.duration ?? 0,
          parsedDuration: formatTime(track.duration ?? 0),
          requester: getRequester(track)
        }
      }else{
        return {
          thumbUrl: null,
          title: "Nothing is currently playing",
          duration: 0,
          parsedDuration: "--.--",
          requester: "None"
        }
      }
    })

    let countingPos = $state(0)
    let prog = $state(10)

    $effect(() => {
      countingPos = initialPos
      if (!isPlaying) return
      const i = setInterval(() => {
        countingPos = countingPos + 1000
      }, 1000)

      return () => clearInterval(i)
    })

    $effect(() => {
      prog = countingPos / (track?.duration ?? 0.1) * 100
    })

</script>

<style>
    .truncated {
        /* Must not be `display: flex` */
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>

<div class="absolute bottom-2 w-full flex items-center justify-center px-4">
    <div class="flex bg-white/85 px-3 pt-3 pb-1 backdrop-blur-2xl rounded-xl space-x-3 w-full max-w-md shadow-lg shrink">
        <div class="flex flex-col shrink-0">
            {#if displayTrackData.thumbUrl}
                <img src={displayTrackData.thumbUrl} alt="thumb-player" class="rounded-xl size-[60px]"/>
            {:else}
                <img src={whaly} alt="Whaly" class="rounded-xl size-[60px]"/>
            {/if}
            <div class="flex items-center justify-center grow mt-1">
                <svg id="Previous" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.2447 18.3107C15.7027 18.5057 16.1737 18.6037 16.6287 18.6037C17.1477 18.6037 17.6467 18.4767 18.0857 18.2257C18.8907 17.7647 19.4077 16.9437 19.5427 15.9037C19.8187 13.4387 19.8187 10.8157 19.5417 8.09772C19.4137 7.06672 18.9147 6.24472 18.1367 5.78272C17.3267 5.30372 16.3037 5.26772 15.2507 5.68572C13.1357 6.54672 11.1137 7.82672 9.40465 9.38772L9.40165 9.39072C8.60165 10.1337 8.16265 11.0667 8.16665 12.0177C8.16965 12.9627 8.60965 13.8847 9.40265 14.6097C11.0717 16.1527 13.0387 17.3987 15.2447 18.3107Z" fill="#000000"></path>
                    <path d="M5.25049 18.4667C4.69849 18.4667 4.25049 18.0187 4.25049 17.4667V6.53174C4.25049 5.97974 4.69849 5.53174 5.25049 5.53174C5.80249 5.53174 6.25049 5.97974 6.25049 6.53174V17.4667C6.25049 18.0187 5.80249 18.4667 5.25049 18.4667Z" fill="#000000"></path>
                </svg>
                <svg id="Pause" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.43263 3.5C5.96763 3.5 4.77563 4.692 4.77563 6.157V17.843C4.77563 19.308 5.96763 20.5 7.43263 20.5C8.89763 20.5 10.0896 19.308 10.0896 17.843V6.157C10.0896 4.692 8.89763 3.5 7.43263 3.5Z" fill="#000000"></path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5673 3.5C15.1023 3.5 13.9103 4.692 13.9103 6.157V17.843C13.9103 19.308 15.1023 20.5 16.5673 20.5C18.0323 20.5 19.2243 19.308 19.2243 17.843V6.157C19.2243 4.692 18.0323 3.5 16.5673 3.5Z" fill="#000000"></path>
                </svg>
                <svg id="Next" class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.91263 18.2258C6.35263 18.4778 6.85263 18.6038 7.37163 18.6038C7.82563 18.6038 8.29463 18.5068 8.75063 18.3138C10.9626 17.3978 12.9296 16.1518 14.5946 14.6118C15.3896 13.8848 15.8296 12.9628 15.8326 12.0168C15.8366 11.0658 15.3976 10.1338 14.5966 9.39078L14.5946 9.38778C12.8846 7.82678 10.8626 6.54578 8.74463 5.68478C7.69663 5.26778 6.67463 5.30378 5.86263 5.78378C5.08363 6.24478 4.58463 7.06678 4.45563 8.10878C4.18063 10.8118 4.18163 13.4348 4.45763 15.9138C4.59163 16.9438 5.10863 17.7658 5.91263 18.2258Z" fill="#000000"></path>
                    <path d="M18.7499 18.4677C18.1979 18.4677 17.7499 18.0197 17.7499 17.4677V6.53271C17.7499 5.98071 18.1979 5.53271 18.7499 5.53271C19.3019 5.53271 19.7499 5.98071 19.7499 6.53271V17.4677C19.7499 18.0197 19.3019 18.4677 18.7499 18.4677Z" fill="#000000"></path>
                </svg>
            </div>
        </div>
        <div class="flex flex-col justify-between w-full pr-[72px]">
            <div class="">
                <div class="flex items-center justify-between space-x-2">
                    <h2 class="break-all truncate">adkfjhaslfahflaiudsfghalisdug {displayTrackData.title}</h2>
                    <HeartIcon/>
                </div>
                <div class="">
                    <div class="flex items-center space-x-2">
                        <div class="flex items-center space-x-1">
                            <svg id="Clock analog" class="size-5" viewBox="0 0 24 24" fill="none" stroke-width="2.2"  xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 21C16.9709 21 21 16.9699 21 12C21 7.02908 16.9709 3 12 3C7.02908 3 3 7.02908 3 12C3 16.9699 7.02908 21 12 21Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M8.2124 14.1953L12 11.9318V7.0426" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path d="M12 11.995V12.005M12.8323 12C12.8323 12.4595 12.4597 12.8322 12.0001 12.8322C11.5405 12.8322 11.168 12.4595 11.168 12C11.168 11.5404 11.5405 11.1678 12.0001 11.1678C12.4597 11.1678 12.8323 11.5404 12.8323 12Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                            <span class="text-sm ">{displayTrackData.parsedDuration}</span>
                        </div>
                        <div class="flex items-center space-x-1 -mt-0.5">
                            <svg id="user" class="size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.1465 3.30078C14.8525 3.30078 17.0465 5.49478 17.0465 8.20078C17.0465 10.9068 14.8525 13.1008 12.1465 13.1008C9.44046 13.1008 7.24646 10.9068 7.24646 8.20078C7.24646 5.49478 9.44046 3.30078 12.1465 3.30078Z" fill="#000000"></path>
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4466 14H9.94656C7.44656 14 5.34656 16.1 5.34656 18.6V18.9C5.34656 19.9 6.14656 20.7 7.14656 20.7H17.1466C18.1466 20.7 19.0466 20 18.9466 18.9V18.6C19.0466 16.1 16.9466 14 14.4466 14Z" fill="#000000"></path>
                            </svg>
                            <span class="text-sm ">{displayTrackData.requester}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div class="text-xs font-medium flex justify-between">
                    <span>{formatTime(countingPos)}</span>
                    <span>{displayTrackData.parsedDuration}</span>
                </div>
                <Slider class={{wrapper: "mb-2"}} disabled={true} bind:progress={prog}/>
            </div>
        </div>
    </div>
</div>