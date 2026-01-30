'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SplitText } from 'gsap/SplitText';
import Image from 'next/image';
import { Open_Sans } from 'next/font/google';
import localFont from 'next/font/local';

// Google Font
const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-open-sans',
});

// Local Custom Font - FIXED PATH
const wildWorld = localFont({
  src: '../public/fonts/wild_world-webfont.woff2', // Fixed: removed '../public'
  variable: '--font-wild-world',
  display: 'swap',
  fallback: ['sans-serif'],
});

export default function SmoothScrollComponent() {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const staggerRef = useRef(null);

  useEffect(() => {
    // Register plugins FIRST
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

    // Kill any existing instances
    ScrollTrigger.getAll().forEach(st => st.kill());
    const existingSmoother = ScrollSmoother.get();
    if (existingSmoother) existingSmoother.kill();

    // IMMEDIATE visibility fix - set opacity to 1 right away
    gsap.set(".heading", {
      opacity: 1,
      yPercent: -150
    });

    // Small delay for DOM to be ready
    const timer = setTimeout(() => {
      try {
        // Create the smooth scroller
        const smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current,
          content: contentRef.current,
          smooth: 1,
          normalizeScroll: true,
          ignoreMobileResize: true,
          effects: true,
          preventDefault: true
        });

        // SplitText animation
        let mySplitText = new SplitText(staggerRef.current, { type: "words,chars" });
        let chars = mySplitText.chars;

        chars.forEach((char, i) => {
          smoother.effects(char, { speed: 1, lag: (i + 1) * 0.1 });
        });
      } catch (error) {
        console.error('GSAP initialization error:', error);
      }
    }, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <style jsx>{`
        :root {
          --fluid-min-width: 320;
          --fluid-max-width: 1140;
          --fluid-screen: 100vw;
          --fluid-bp: calc(
            (var(--fluid-screen) - var(--fluid-min-width) / 16 * 1rem) /
            (var(--fluid-max-width) - var(--fluid-min-width))
          );
        }

        @media screen and (min-width: 1140px) {
          :root {
            --fluid-screen: calc(var(--fluid-max-width) * 1px);
          }
        }

        :root {
          --f-0-min: 18;
          --f-0-max: 20;
          --step-0: calc(
            ((var(--f-0-min) / 16) * 1rem) + (var(--f-0-max) - var(--f-0-min)) *
            var(--fluid-bp)
          );

          --f-1-min: 20;
          --f-1-max: 24;
          --step-1: calc(
            ((var(--f-1-min) / 16) * 1rem) + (var(--f-1-max) - var(--f-1-min)) *
            var(--fluid-bp)
          );
        }

        * {
          box-sizing: border-box;
        }

        .smooth-scroll-wrapper {
          background-color: #141313;
          font-family: var(--font-open-sans), sans-serif;
          color: white;
          overscroll-behavior: none;
          margin: 0;
          padding: 0;
          font-weight: 300;
          overflow-x: hidden;
          font-size: var(--step-0);
        }

        .smooth-section {
          min-height: 100vh;
        }

        .smooth-scroll-wrapper p {
          line-height: 1.35;
        }

        #content {
          padding: 0 0.75rem;
          overflow: visible;
          width: 100%;
        }

        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 0.5rem;
        }

        .smooth-scroll-wrapper h1,
        .smooth-scroll-wrapper h2,
        .smooth-scroll-wrapper h3,
        .smooth-scroll-wrapper h4,
        .smooth-scroll-wrapper p {
          margin: 0;
        }

        .flow--lg > * + * {
          margin-top: 2em;
        }

        .flow > * + * {
          margin-top: 1em;
        }

        .title {
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          min-height: 50vh;
        }

        .heading {
          position: absolute;
          top: 50vh;
          left: 50%;
          transform: translateX(-50%);
          opacity: 1; /* CHANGED: was 0, now 1 - GSAP will handle this */
          z-index: 1;
        }

        .smooth-scroll-wrapper h1 {
          font-size: clamp(12px, 8vw, 100px);
          text-align: center;
          line-height: 0.67;
          margin: 0 auto;
          font-family: var(--font-wild-world), sans-serif;
        }

        .smooth-scroll-wrapper h1 .eyebrow {
          font-family: var(--font-open-sans), sans-serif;
          font-size: clamp(12px, 3vw, 40px);
          font-weight: 400;
        }

        .heading p {
          font-family: var(--font-wild-world), sans-serif;
          font-size: 15.5vw;
          font-size: clamp(12px, 12.5vw, 250px);
          text-align: center;
          line-height: 0.67;
          margin: 0;
          color: #111;
          -webkit-text-stroke-width: 1.5px;
          -webkit-text-stroke-color: white;
          z-index: -10;
        }

        .intro,
        .smooth-scroll-wrapper h2,
        .smooth-scroll-wrapper h3 {
          font-size: var(--step-1);
          font-weight: 500;
        }

        .text-container {
          position: relative;
        }

        .text-container p {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          color: transparent;
        }

        .text-container p:first-child {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999;
          color: white;
        }

        .image-grid {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          grid-column-gap: 0.2rem;
          grid-row-gap: 0.2rem;
          width: 98vw;
          margin: 0 auto;
          padding-top: 40vh;
          z-index: 0;
        }

        .image-grid .image_cont {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
        }

        .image-grid img {
          position: absolute;
          top: 0;
          width: 100%;
          height: 150%;
          object-fit: cover;
        }

        .image-grid .image_cont:nth-child(1) {
          grid-column: 1;
          grid-row: 1;
        }

        .image-grid .image_cont:nth-child(2) {
          grid-column: 3;
          grid-row: 2;
        }

        .image-grid .image_cont:nth-child(3) {
          grid-column: 2;
          grid-row: 3;
        }

        .parallax-images {
          margin-top: 10vh;
          padding: 10rem 1rem;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-column-gap: 1rem;
          grid-row-gap: 20vh;
          align-items: center;
          justify-items: center;
        }

        .parallax-images .image_cont {
          position: relative;
          height: 80vh;
          overflow: hidden;
        }

        .parallax-images img {
          position: absolute;
          bottom: 0;
          margin: 0 auto;
          height: 140%;
          width: 100%;
          object-fit: cover;
        }

        .parallax-images .parallax-text {
          grid-column: 2;
          grid-row: 1;
        }

        .parallax-images .image_cont:nth-child(2) {
          grid-column: 1 / span 1;
          grid-row: 1;
          width: 100%;
        }

        .parallax-images .image_cont:nth-child(3) {
          grid-column: 2 / span 1;
          grid-row: 2;
        }

        .spacer {
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stagger {
          font-size: 8vw;
        }

        .bars {
          display: flex;
          flex-wrap: wrap;
          column-gap: 4rem;
        }

        .bars .bars-text {
          flex: 1 1 300px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }

        .bars .bars-cont {
          flex: 1 1 500px;
          display: flex;
          width: 100%;
          height: 60vh;
          align-items: flex-end;
        }

        .bars .bar {
          border-radius: 10px;
          margin: 2vw;
          text-align: center;
          flex: 1 0 auto;
          font-size: var(--step-0);
          justify-self: flex-end;
          font-family: var(--font-wild-world), sans-serif;
          font-size: clamp(16px, 3vw, 36px);
        }

        .content {
          border-left: solid 1px white;
          padding: 0.5rem 2rem;
        }

        .staggered {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          column-gap: 4rem;
        }

        .staggered h3 {
          font-family: var(--font-wild-world), sans-serif;
          font-size: clamp(16px, 6vw, 80px);
          letter-spacing: 0.03em;
        }

        .staggered_text {
          flex: 1 1 300px;
        }

        .staggered_demo {
          flex: 1 1 500px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .parallax-slab {
          position: relative;
          height: 500px;
          width: 100%;
          max-height: 500px;
          overflow: hidden;
        }

        .parallax-slab img {
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 180%;
          object-fit: cover;
        }

        .v-center {
          display: flex;
          align-items: center;
        }

        .spacer {
          height: 10vh;
        }
        
      `}</style>

      <div ref={wrapperRef} id="wrapper" className={`smooth-scroll-wrapper ${openSans.variable} ${wildWorld.variable}`}>
        <section ref={contentRef} id="content">
          <div className="heading" aria-hidden="true">
            <p>जीLive</p>
            <div className="text-container">
              <p>जीLive</p>
              <p data-speed="0.95">जीLive</p>
              <p data-speed="0.9">जीLive</p>
              <p data-speed="0.85">जीLive</p>
              <p data-speed="0.8">जीLive</p>
              <p data-speed="0.75">जीLive</p>
              <p data-speed="0.7">जीLive</p>
            </div>
          </div>

          <section className="image-grid container smooth-section">
            <div className="image_cont" data-speed="1">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (1).webp" alt="" />
            </div>
            <div className="image_cont" data-speed="1.7">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (4).webp" alt="" />
            </div>
            <div className="image_cont" data-speed="1.5">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (3).webp" alt="" />
            </div>
          </section>

          <section className="title container flow--lg smooth-section">
            <h1><span className="eyebrow" aria-hidden="true">Experience  </span>The Ultimate ProShow</h1>
          </section>

          <section className="bars container smooth-section">
            <div className="bars-text">
              <div className="flow content">
                <h2>7:00 PM</h2>
                <p>@Musaliar College Pathanamthitta</p>
              </div>
            </div>
            <div className="bars-cont">
              <div className="bar" data-speed="0.8">
                <p>06 /</p>
              </div>
              <div className="bar" data-speed="0.9">
                <p>02 /</p>
              </div>
              <div className="bar" data-speed="1">
                <p>20</p>
              </div>
              <div className="bar" data-speed="1.1">
                <p>26</p>
              </div>
              <div className="bar" data-speed="1.2">
                <p>...</p>
              </div>
            </div>
          </section>

          <section className="v-center smooth-section">
            <div className="parallax-slab">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (6).webp" alt="" />
            </div>
          </section>

          <section className="staggered container smooth-section">
            <div className="staggered_text">
              <div className="flow content">
                <h2>Follow the Rhythm</h2>
                <p>Let the music guide you through an unforgettable night of celebration and entertainment.</p>
              </div>
            </div>
            <div className="staggered_demo">
              <h3 ref={staggerRef} id="split-stagger">जीLive...</h3>
            </div>
          </section>

          <section className="parallax-images container smooth-section">
            <div className="parallax-text">
              <div className="flow content">
                <h2>Connect</h2>
                <p>Follow <strong>@g__live_</strong> on Instagram for all the latest news about the जीLive</p>
              </div>
            </div>
            <div className="image_cont">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (5).webp" alt="" />
            </div>
            <div className="image_cont">
              <img data-speed="auto" src="/images/proshow/gLive/gLive (5).webp" alt="" />
            </div>
            <Image
              src="/images/proshow/gLive/glivelogo.webp"
              width={126}
              height={126}
              alt='logoGLive'
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            />
          </section>
        </section>
      </div>
    </>
  );
}