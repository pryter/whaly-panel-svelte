<script lang="ts">
  import AnimatedIcon from "$lib/components/icons/AnimatedIcon.svelte";
  import type {AnimationItem} from "lottie-web";

  let clicked = $state(false)
  let con = $state<AnimationItem | null>(null)
  function clickAction() {
    con?.goToAndPlay(0)
    if (con) {


    }
  }
</script>
<div onmousedown={clickAction} class="cursor-pointer shrink-0 size-5">
    <AnimatedIcon bindController={(ref)=>{con = ref}} name="heart" class="size-5" />
</div>