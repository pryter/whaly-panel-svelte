<script lang="ts">
    import {animate, press} from "motion";
    import {twMerge} from "tailwind-merge";
    import type {Snippet} from "svelte";
    import {fade} from "svelte/transition";

    type DefaultInputProps = {
      placeholder?: string,
      name: string
      type?: "text" | "email" | "password"
    }

    type classpart = {
      input?: string,
      wrapper?: string
    }
    type VisManager = {
      show: () => void,
      hide: () => void
    }

    type Props = {
      value?: string,
      label?: "inside" | "outside" | false,
      variant?: "flat" | "outline"
      icon?: Snippet
      action?: Snippet<[string, VisManager]>,
      showActionFn?: (value: string) => boolean,
      class?: classpart
    } & DefaultInputProps

    let {label = "inside",type = "text", name, placeholder, icon,action,showActionFn = () => true,value = $bindable(""), variant = "flat", ...rest}: Props = $props();

    const initialValue = value
    let labelRef: HTMLLabelElement;

    let showAction = $derived(showActionFn(value))
    let isOutline = $derived(variant === "outline")
    let showPass = $state(false)
    let isStatic = $derived((placeholder && label === "inside") || icon !== undefined || label === "outside")

    const visManager = {
      show: () => showPass = true,
      hide: () => showPass = false
    }

    function onfocus() {
      if (isStatic || value !== "") return
      animate(labelRef, {top: 0,left:0, scale: 0.8}, {duration: 0.25})
    }

    function onblur() {
      if (isStatic) return
        if (value === "") {
            animate(labelRef, {top: "unset",left:"unset", scale: 1}, {duration: 0.25})
        }
    }
</script>

<div class="relative w-full">
    {#if isOutline && label === "outside"}
        <div class="z-1 top-0 h-1 py-0 absolute pr-2 ml-3 bg-white"><span class="opacity-0">{name}</span></div>
    {/if}
    {#if isStatic && label !== "inside" || icon}
        <label for="input" class={twMerge("text-gray-500 pl-1 py-1", isOutline && "z-1 top-0 -mt-2.5 px-2 py-0 absolute mx-2")}>{name}</label>
    {/if}

    <div class={twMerge("bg-gray-100 relative rounded-xl px-2 flex items-center", isOutline ? "border-2 border-gray-800 bg-white" : "", rest.class?.wrapper)}>
        {#if (!isStatic || label === "inside") && !icon }
            <div class="absolute flex h-full items-center transition-all px-2">
                <label style={isStatic || initialValue !== "" ? "top:0;left:0;transform: scale(0.8);" : ""} bind:this={labelRef} for="input" class="absolute text-gray-500 pl-1 py-1">{name}</label>
            </div>
        {/if}
        <div class="shrink-0">
            {@render icon?.()}
        </div>
        <input onfocus={onfocus} onblur={onblur} placeholder={placeholder} bind:value={value} type={showPass ? "text" : type} class={twMerge("w-full h-full px-2 pb-2 outline-none", (!isStatic || label === "inside") && !icon ? "pt-6" : "pt-3 pb-3", rest.class?.input)}/>
        {#if showAction}
            <div transition:fade={{duration: 400}}>
                {@render action?.(value, visManager)}
            </div>
        {/if}
    </div>
</div>