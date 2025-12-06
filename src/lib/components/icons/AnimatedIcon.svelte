<script lang="ts">

  import lottie, {type AnimationItem} from "lottie-web";
  type $$Props = { bindController?: (ref: AnimationItem) => void, name: string,playOnTap?: boolean, [key: string]: any}
  let {bindController,name,playOnTap, ...rest}: $$Props = $props()
  let srcPath = $derived(`/animated/${name}.json`)
  let container = $state<HTMLDivElement>()
  let sc: AnimationItem | undefined

  $effect(()=>{
    if (container) {
      let controller = lottie.loadAnimation({
        path: srcPath,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        container: container,
      })
      sc = controller
      bindController?.(controller)
    }
  })

  function onClick(){
    if (playOnTap) {
      sc?.goToAndPlay(0)
    }
  }
</script>

<div onclick={onClick} bind:this={container} {...rest}>
</div>
