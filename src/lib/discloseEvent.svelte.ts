import {animate, type AnimationOptions, type DOMKeyframesDefinition} from "motion";

type AnimationRegistry = {keyframe: DOMKeyframesDefinition, options?: AnimationOptions}

export class DiscloseEvent {

  public isOpen = $state(false)
  public element = $state<HTMLElement>()
  private animation: {entry?: AnimationRegistry, exit?: AnimationRegistry}
  private onStateChangeCB: (state: boolean) => void = () => {}

  constructor(animation: {entry?: AnimationRegistry, exit?: AnimationRegistry}) {
    this.animation = animation

    $effect(() => {
      if (!this.element) return

      if (this.isOpen) {
        if (this.animation.entry) {
          animate(this.element, this.animation.entry.keyframe, this.animation.entry.options)
        }
        this.onStateChangeCB(true)
        return;
      }
      if (this.animation.exit) {
        animate(this.element, this.animation.exit.keyframe, this.animation.exit.options)
        this.onStateChangeCB(false)
      }
    })
  }

  public toggle() {
    this.isOpen = !this.isOpen
  }

  public set(isOpen: boolean) {
    this.isOpen = isOpen
  }

  public onStateChange(cb: (state: boolean) => void) {
    this.onStateChangeCB = cb
  }
}