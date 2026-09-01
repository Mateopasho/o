"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ambient video layer behind the hero.
 *
 * ── How legibility is handled ───────────────────────────────────────────────
 * The copy sits in a left column on a solid white wash; the footage is only
 * ever fully visible to the right of it. That is a directional relationship the
 * layout explains, unlike the soft radial mask this replaced — which floated an
 * unexplained oval in the middle of the frame and read as a smudge.
 *
 * ── Behaviour ───────────────────────────────────────────────────────────────
 * · Decorative only: aria-hidden, never announced, never focusable.
 * · `prefers-reduced-motion` stops it dead — the poster frame shows instead.
 *   Looping background video is the canonical thing that setting exists for.
 * · Pauses when scrolled out of view, so it costs nothing while you read the
 *   rest of the page.
 * · Degrades to the poster, then to plain white, if the file is absent.
 */
export function HeroVideo({
  src = "/media/hero-diver.mp4",
  poster = "/media/hero-diver.jpg",
  /**
   * Half speed. Ambient background footage at 1× reads as a video the viewer
   * is expected to watch; well under real time reads as atmosphere and stops
   * competing with the copy for attention.
   *
   * 0.5 is the practical floor — browsers mute audio below ~0.5 anyway (moot
   * here, the track is muted) and slower than this the motion starts to look
   * like dropped frames rather than a deliberate slow-down.
   */
  playbackRate = 0.5,
}: {
  src?: string;
  poster?: string;
  playbackRate?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllowed(!media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!allowed) {
      el.pause();
      return;
    }

    // Re-applied on load too: some browsers reset playbackRate when the
    // element's source finishes loading, which would silently drop it to 1×.
    const setRate = () => {
      el.playbackRate = playbackRate;
    };
    setRate();
    el.addEventListener("loadedmetadata", setRate);

    // Only play while the hero is actually on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("loadedmetadata", setRate);
    };
  }, [allowed, playbackRate]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        // autoPlay is deliberately NOT set: playback is started by the observer
        // above, and only when reduced-motion is off.
        className="size-full object-cover object-[70%_center] sepia-[0.22] saturate-[1.2] contrast-[1.08]"
      />

      {/*
        Warm cast. The raw clip is cold blue, which fought the gold palette and
        made the whole hero feel like a different brand. Sepia on the video plus
        a gold-ribbon multiply pulls it into the same family as the ribbon, the
        chips and the active nav underline.

        Kept deliberately light. Two earlier attempts — a flat #FFF3D6 at 75%,
        and a 55% multiply stacked with a second gold wash — both matched the
        ribbon but bleached the footage until the gauge was invisible. One
        multiply at 28% warms it without hiding what it is.
      */}
      <div className="absolute inset-0 bg-gold-ribbon/28 mix-blend-multiply" />

      {/*
        Left-weighted scrim, not a radial blob.

        The blob version failed for a simple reason: a soft ellipse floating in
        the middle of a photograph reads as a mistake — a lens smudge — because
        nothing in the layout explains its shape. A directional gradient reads
        as intent, because it follows the edge of the text column.

        Solid at the left where the copy sits, gone by ~78% so the gauge is
        fully legible on the right.
      */}
      <div className="absolute inset-0 bg-linear-to-r from-white from-24% via-white/78 via-44% to-transparent to-62%" />
      {/* Below lg the copy spans the full width, so the wash covers everything. */}
      <div className="absolute inset-0 bg-white/72 lg:hidden" />

      <div className="absolute inset-x-0 top-0 h-10 bg-linear-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white to-transparent" />
    </div>
  );
}

/**
 * Vecteezy's Free License requires a visible, linked credit wherever the asset
 * appears. Keeping it in the same component as the video means the credit can
 * never be separated from the thing it credits.
 */
export function HeroVideoCredit() {
  return (
    <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
      Hero footage{" "}
      <a
        href="https://www.vecteezy.com/video/1615331-diver-testing-air-supply-levels"
        target="_blank"
        rel="noopener noreferrer"
        className="text-faint-2 underline underline-offset-2 hover:text-muted"
      >
        by Vecteezy
      </a>
    </p>
  );
}
