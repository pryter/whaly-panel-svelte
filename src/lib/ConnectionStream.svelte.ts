import type {Queue, Track, UnresolvedTrack} from "erela.js";
import {play} from "$lib/play.svelte.ts";
import {confirm} from "$lib/confirm.ts";

export const getRequester = (track: Track | UnresolvedTrack | null) => {
  if (!track) return "remote"
  const req = track.requester as {globalName: string}
  if (req.globalName) {
    return req.globalName
  }
  return "remote"
}

export class QueueStream {
  public next = $state<Track | UnresolvedTrack | null>(null)
  public rest: (Track | UnresolvedTrack)[] = $state([])
  public queue = $state<Queue>()

  constructor() {
    $effect(() => {
      if (!this.queue) return
      this.next = this.queue[0]
      if (this.queue.length > 1) {
        this.rest = this.queue?.slice(1) ?? []
      }else{
        this.rest = []
      }
    })
  }

  public setQueue(queue: Queue) {
    this.queue = queue
  }
}

export class ConnectionStream {
  public state = $state("idle")
  private sid
  public isPlaying = $state(false)
  public currentTrack = $state<Track | UnresolvedTrack | null>(null)
  public queue = new QueueStream()
  public streamInitialPosition = $state(0)

  constructor(sid: string) {
    this.sid = sid
  }

  public async confirm(sessId: string, selection: string) {
    return await confirm(sessId, selection)
  }

  public async search(query: string) {
    const res = await play(query, this.sid)
    return res
  }

  public connect() {
    this.createConnection()
  }

  private createConnection() {
    try {
      const ws = new WebSocket(this.getWSUrl());
      ws.onerror = () => {
        this.state = "error"
      }
      ws.onclose = () => {
        this.state = "closed"
      }

      ws.onmessage = (msg) => {
        this.state = "connected"
        const obj = JSON.parse(msg.data)

        if (obj.state === "DESTROYING" || obj.disconnected) {
          this.state = "disconnected"
        }

        this.queue.setQueue(obj.queue)
        this.streamInitialPosition = obj.position
        this.currentTrack = obj.current
        this.isPlaying = obj.isPlaying
      }

    } catch (e) {
      this.state = "error"
    }
  }

  private getWSUrl() {
    const wsUrl =
      window.location.hostname === "localhost"
        ? `ws://localhost:3223?gid=${this.sid}`
        : `wss://api.whaly.pryter.me/ws?gid=${this.sid}`;
    return wsUrl;
  }
}