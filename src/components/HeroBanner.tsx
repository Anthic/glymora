"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "./Navbar";
import { DiscountMarquee } from "./DiscountMarquee";
import { StarBlingIcon, ButtonArrowIcon } from "./Icons";

const TOP_LETTERS = ["p", "e", "a", "r", "l"];
const BOTTOM_LETTERS = ["p", "o", "i", "s", "e"];

export function HeroBanner() {
  const [topActiveIndex, setTopActiveIndex] = useState<number>(-1);
  const [isHoldingFull, setIsHoldingFull] = useState<boolean>(false);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  // Parallax / Scroll Progress State (0% to 100%)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoFloating, setIsAutoFloating] = useState<boolean>(true);

  const leftBoxRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLImageElement>(null);
  const bannerRef = useRef<HTMLElement>(null);

  // Auto-float loop references
  const autoFloatProgressRef = useRef<number>(0);
  const autoFloatDirRef = useRef<number>(1);
  const isAutoFloatingRef = useRef<boolean>(true);

  // Keep ref in sync with state
  useEffect(() => {
    isAutoFloatingRef.current = isAutoFloating;
  }, [isAutoFloating]);

  // ----------------------------------------------------------------------
  // 1. ANIMATION A-42: Initial Entrance Animation
  // ----------------------------------------------------------------------
  const playEntrance = useCallback(() => {
    if (!leftBoxRef.current || !rightBoxRef.current) return;
    const leftEl = leftBoxRef.current;
    const rightEl = rightBoxRef.current;

    leftEl.style.transition = "none";
    rightEl.style.transition = "none";
    leftEl.style.transform = "translateX(-63%)";
    rightEl.style.transform = "translateX(63%)";

    requestAnimationFrame(() => {
      setTimeout(() => {
        leftEl.style.transition = "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)";
        rightEl.style.transition = "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)";
        leftEl.style.transform = "translateX(0%)";
        rightEl.style.transform = "translateX(0%)";
      }, 80);
    });
  }, []);

  useEffect(() => {
    playEntrance();
  }, [playEntrance]);

  // ----------------------------------------------------------------------
  // 2. ANIMATION A-70: Sequential Letter Illumination Wave
  // ----------------------------------------------------------------------
  useEffect(() => {
    let isCancelled = false;

    async function textSequence() {
      if (isCancelled) return;

      // Start by resetting
      setIsFadingOut(false);
      setIsHoldingFull(false);
      setTopActiveIndex(-1);

      await new Promise((r) => setTimeout(r, 400));
      if (isCancelled) return;

      for (let i = 0; i < 5; i++) {
        setTopActiveIndex(i);
        await new Promise((r) => setTimeout(r, 450));
        if (isCancelled) return;
      }

      // All 5 letters are now active - hold for 2.2s
      setIsHoldingFull(true);
      await new Promise((r) => setTimeout(r, 2200));
      if (isCancelled) return;

      // Graceful fade out
      setIsFadingOut(true);
      await new Promise((r) => setTimeout(r, 600));
      if (isCancelled) return;

      textSequence();
    }

    textSequence();

    return () => {
      isCancelled = true;
    };
  }, []);

  // ----------------------------------------------------------------------
  // 3. ANIMATION A-46: Ring Parallax Progress (0% to 100%)
  // ----------------------------------------------------------------------
  const applyParallax = useCallback((p: number) => {
    setScrollProgress(p);

    if (!ringRef.current) return;

    let ringY = 0;
    let ringScale = 1.0;
    let boxOffset = 0; // %

    if (p <= 45) {
      const t = p / 45;
      ringY = 124 - 124 * t;
      ringScale = 0.5 + 0.5 * t;
      boxOffset = 0;
    } else if (p <= 60) {
      const t = (p - 45) / 15;
      ringY = 0;
      ringScale = 1.0;
      boxOffset = 44 * t;
    } else if (p <= 80) {
      const t = (p - 60) / 20;
      ringY = -(141 * t);
      ringScale = 1.0 - 0.5 * t;
      boxOffset = 44 * (1 - t * 0.5);
    } else {
      ringY = -141;
      ringScale = 0.5;
      boxOffset = 22;
    }

    ringRef.current.style.transform = `translateY(${ringY}%) scale(${ringScale})`;

    if (leftBoxRef.current && rightBoxRef.current) {
      leftBoxRef.current.style.transform = `translateX(${boxOffset}%)`;
      rightBoxRef.current.style.transform = `translateX(${-boxOffset}%)`;
    }
  }, []);

  // Auto-float loop
  useEffect(() => {
    let animId: number;

    function loop() {
      if (isAutoFloatingRef.current) {
        autoFloatProgressRef.current += 0.35 * autoFloatDirRef.current;
        if (autoFloatProgressRef.current >= 75) {
          autoFloatDirRef.current = -1;
        } else if (autoFloatProgressRef.current <= 0) {
          autoFloatDirRef.current = 1;
        }
        applyParallax(autoFloatProgressRef.current);
      }
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(animId);
  }, [applyParallax]);

  // Window Scroll handling
  useEffect(() => {
    function handleScroll() {
      if (isAutoFloatingRef.current || !bannerRef.current) return;
      const rect = bannerRef.current.getBoundingClientRect();
      const totalHeight = window.innerHeight;
      const p = Math.min(100, Math.max(0, (-rect.top / totalHeight) * 100));
      applyParallax(p);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [applyParallax]);

  // Slider change handler
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoFloating(false);
    isAutoFloatingRef.current = false;
    applyParallax(parseFloat(e.target.value));
  };

  return (
    <>
      {/* Floating REA Interactive Animation Control Bar */}
      <aside className="control-deck" aria-label="Animation Controls">
        <div className="control-deck-title">
          <span>REA Animation Controller</span>
          <span style={{ fontSize: "10px", color: "#888" }}>Webflow IX2</span>
        </div>

        <div className="control-deck-row">
          <button className="btn-deck" onClick={playEntrance}>
            Replay Entrance (a-42)
          </button>
          <button
            className="btn-deck"
            onClick={() => setIsAutoFloating((prev) => !prev)}
            style={{ opacity: isAutoFloating ? 1 : 0.6 }}
          >
            Auto Ring Float: {isAutoFloating ? "ON" : "OFF"}
          </button>
        </div>

        <div className="slider-container">
          <div className="control-deck-row">
            <label htmlFor="scroll-slider">Scroll Parallax (a-46):</label>
            <span
              style={{
                fontSize: "12px",
                color: "var(--_color---primary-color)",
                fontWeight: 600,
              }}
            >
              {Math.round(scrollProgress)}%
            </span>
          </div>
          <input
            id="scroll-slider"
            type="range"
            min="0"
            max="100"
            value={scrollProgress}
            onChange={handleSliderChange}
          />
        </div>
      </aside>

      {/* Main Hero Banner */}
      <section className="section hero" id="hero-banner" ref={bannerRef}>
        <div className="hero-layout">
          {/* Top Navbar */}
          <Navbar />

          {/* Top Typography: P E A R L */}
          <div className="hero-top-box">
            <div className="top-text-box">
              {TOP_LETTERS.map((letter, idx) => {
                const isCurrentActive = topActiveIndex === idx && !isHoldingFull;
                const isPastActive = idx <= topActiveIndex;
                const opacity = isFadingOut ? 0.15 : isPastActive ? 1 : 0;
                const color = isCurrentActive ? "var(--_color---primary-color)" : "#ffffff";

                return (
                  <span
                    key={`top-${idx}`}
                    className={`hero-title-text ${
                      ["one", "two", "three", "four", "five"][idx]
                    }`}
                    style={{ opacity, color }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>

            <div className="hero-text-content">
              <StarBlingIcon className="star-icon star-pulse" />
              <p>Eternal Elegance</p>
            </div>
          </div>

          {/* Middle Content: Left Portrait & Right Necklace */}
          <div className="hero-middle-content">
            <div className="middle-content-wrap">
              {/* Left Card */}
              <div className="middle-left-box" ref={leftBoxRef}>
                <div className="hero-text-content vertical reverse">
                  <StarBlingIcon className="star-icon star-pulse" />
                  <p>Timeless beauty</p>
                </div>
                <div className="hero-image-card">
                  <Image
                    src="/portrait_left.webp"
                    alt="Elegant Jewelry Portrait"
                    width={320}
                    height={240}
                    className="hero-image"
                    priority
                  />
                </div>
              </div>

              {/* Right Card */}
              <div className="middle-right-box" ref={rightBoxRef}>
                <div className="hero-image-card">
                  <Image
                    src="/necklace_right.webp"
                    alt="Elegant Pearl Necklace"
                    width={320}
                    height={240}
                    className="hero-image"
                    priority
                  />
                </div>
                <div className="hero-text-content vertical">
                  <StarBlingIcon className="star-icon star-pulse" />
                  <p>Timeless beauty</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Floating 3D Jewelry Ring (Scroll Target a-46) */}
          <div className="hero-item-image-wrap">
            <Image
              ref={ringRef}
              src="/ring_center.webp"
              alt="Gold Ring with Diamond"
              width={595}
              height={595}
              className="hero-item-image"
              priority
            />
          </div>

          {/* Bottom Content: Buttons & P O I S E */}
          <div className="hero-bottom-content">
            <div className="hero-button-box">
              <Link href="#shop" className="btn-luxury">
                <div className="button-arrow-box-wrap white">
                  <div className="button-arrow-box">
                    <ButtonArrowIcon className="button-arrow" isBlack={true} />
                  </div>
                </div>
                <div className="button-text-box">
                  <p>Visit shop</p>
                </div>
              </Link>

              <Link href="#contact" className="btn-luxury">
                <div className="button-arrow-box-wrap">
                  <div className="button-arrow-box">
                    <ButtonArrowIcon className="button-arrow" isBlack={false} />
                  </div>
                </div>
                <div className="button-text-box">
                  <p>Contact</p>
                </div>
              </Link>
            </div>

            <div className="hero-bottom-box">
              <div className="bottom-text-box">
                {BOTTOM_LETTERS.map((letter, idx) => {
                  const isCurrentActive = topActiveIndex === idx && !isHoldingFull;
                  const isPastActive = idx <= topActiveIndex;
                  const opacity = isFadingOut ? 0.15 : isPastActive ? 1 : 0;
                  const color = isCurrentActive ? "var(--_color---primary-color)" : "#ffffff";

                  return (
                    <span
                      key={`bottom-${idx}`}
                      className={`hero-title-text ${
                        ["one", "two", "three", "four", "five"][idx]
                      }`}
                      style={{ opacity, color }}
                    >
                      {letter}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Marquee Ticker */}
        <DiscountMarquee />
      </section>

      {/* Auxiliary Scroll Demo Section */}
      <section className="scroll-helper-section">
        <h2>Scroll To Experience Parallax Interaction</h2>
        <p>
          In Glymora&apos;s Webflow architecture, continuous action <code>a-46</code>{" "}
          is triggered via scroll progress: the diamond ring ascends from below,
          zooms into focus at dead center, the portrait cards squeeze closer,
          and the ring glides upwards into the page.
        </p>
        <div style={{ height: "600px" }} />
      </section>
    </>
  );
}
