<script lang="ts">
  import {animate, hover, press} from "motion";
  import {twMerge} from "tailwind-merge";

  type Props = {
    progress: number
    disabled?: boolean
    glassEffect?: boolean
    class?: CustomClass
  }

  type CustomClass = {
    wrapper?: string,
    trackWrapper?: string,
    track?: string,
    slider?: string,
  }

  let {progress = $bindable(0), disabled = false, glassEffect = true, ...p}: Props = $props();

  let slider = $state<HTMLDivElement>()
  let track = $state<HTMLDivElement>()

  let moving = $state(false);
  let left = $state(0);

  function onMouseDown() {
    if (disabled) return;
    left = progress * getTrueWidth() / 100
    moving = true;
  }

  function getTrueWidth()  {
    const scale = window.visualViewport?.scale || 1
    if (track) {
      return track?.clientWidth * scale
    }else{
      return 0
    }
  }

  function onMouseMove(e: any) {
    if (moving) {
      left += e.movementX;
      if (track) {
        const w = getTrueWidth()
        progress = Math.min(Math.max(left / w * 100, 0), 100);
      }
    }
  }

  function onMouseUp() {
    moving = false;
  }

  $effect(() => {
    if (slider) {
      hover(slider, (element) => {
        animate(element, { scale: 1.05 }, {type: "spring", stiffness: 200})

        return () => animate(element, { scale: 1 }, {type: "spring", stiffness: 200})
      })

      press(slider, (element) => {
        animate(element, {scale: 1.3}, {type: "spring", stiffness: 200})
        const color = element.children.item(0) as HTMLDivElement
        if (glassEffect) {
          animate(color, {opacity: 0.2}, {type: "tween"})
          animate(element, {background: "rgba(255,255,255 0.1)"}, {type: "tween"})
        }
        return () => {
          animate(element, {scale: 1, background: "rgba(255,255,255,1)"}, {type: "spring", stiffness: 200})
          animate(color, {opacity: 1}, {type: "tween"})
        }
      })
    }
  })
</script>

<div class={twMerge("relative py-1 w-full", p.class?.wrapper)}>
    <div bind:this={track} class={twMerge("relative w-full h-[6px] bg-gray-300 rounded-full", p.class?.trackWrapper)}>
        <div style="width: {progress}%" class={twMerge("absolute h-[6px] bg-blue-500 rounded-full z-10", p.class?.track)}>
            <div class="right-[-32px] flex items-center justify-center absolute size-[64px] -top-[29px]">
                <div role="slider" aria-valuenow={progress} tabindex="-1" bind:this={slider} class={twMerge("shadow-sm absolute w-4 h-3 overflow-clip rounded-full cursor-pointer shadow-white", p.class?.slider)}
                     onmousedown={onMouseDown}
                     style="background: rgba(255,255,255,1);backdrop-filter: blur(1px);">
                    <div class={twMerge("w-full h-full bg-white",p.class?.slider)}></div>
                </div>
            </div>
        </div>
    </div>
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />