<script lang="ts">
  import type {Snippet} from "svelte";
  import type {AnimationItem} from "lottie-web";
  import {twMerge} from "tailwind-merge";
  import {animate, hover, press} from "motion";

  type ButtonATypeProps = {href?: string, target?: string, clickAction?: () => void}
  type Props = {text?: string, icon: Snippet<[(ref: AnimationItem) => void]>,type?: "a" | "button" | "div", class?: string} & ButtonATypeProps;

  const {type = "button", ...p}: Props = $props();
  let animCtl = $state<AnimationItem | undefined>();
  let bref = $state<HTMLButtonElement | HTMLAnchorElement>();

  function bind(ref: AnimationItem) {
    animCtl = ref;
  }

  function play() {
    animCtl?.goToAndPlay(0);
  }

  $effect(() => {
    if (bref) {
      hover(bref, (element) => {
        animate(element, { scale: 1.04 }, {type: "spring", stiffness: 200})

        return () => animate(element, { scale: 1 }, {type: "spring", stiffness: 200})
      })

      press(bref, (element) => {
        animate(element, {scale: 0.98}, {type: "spring", stiffness: 200})
        return () => animate(element, {scale: 1.02}, {type: "spring", stiffness: 200})
      })
    }
  })

</script>
{#if type === "a"}
    <a bind:this={bref} href={p.href} target={p.target} onmouseenter={() => {play()}} class={twMerge("flex cursor-pointer items-center space-x-2 rounded-xl bg-opacity-50 py-2 pl-5 pr-6 font-medium text-gray-100 shadow-md", p.class)}>
        <div class="shrink-0">
            {@render p.icon(bind)}
        </div>
        {#if p.text}<span class="w-full">{p.text}</span>{/if}
    </a>
{:else if type === "button"}
    <button bind:this={bref} onmousedown={p.clickAction} onmouseenter={() => {play()}} class={twMerge("flex cursor-pointer items-center space-x-2 rounded-xl bg-opacity-50 py-2 pl-5 pr-6 font-medium text-gray-100 shadow-md", p.class)}>
        <div class="shrink-0">
            {@render p.icon(bind)}
        </div>
        {#if p.text}<span class="w-full">{p.text}</span>{/if}
    </button>
{/if}