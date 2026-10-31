import React from "react";
import Link from "next/link";
import { GlymoraLogo } from "./Icons";

export function Navbar() {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-logo-box">
        <Link href="/" className="navbar-logo" aria-label="Glymora Home">
          <GlymoraLogo />
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link href="#about">About</Link>
        </li>
        <li>
          <Link href="#pages">Pages ▾</Link>
        </li>
        <li>
          <Link href="#contact">Contact</Link>
        </li>
      </ul>

      <Link href="#cart" className="cart-btn">
        Cart (0)
      </Link>
    </nav>
  );
}
