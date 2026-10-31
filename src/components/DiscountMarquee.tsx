import React from "react";
import { DiscountDiamondIcon } from "./Icons";

const MARQUEE_ITEMS = [
  "Enjoy 20% off all diamond rings",
  "Get 15% off your first jewelry purchase",
  "Enjoy 20% off all diamond rings",
  "Get 15% off your first jewelry purchase",
  "Enjoy 20% off all diamond rings",
  "Get 15% off your first jewelry purchase",
];

export function DiscountMarquee() {
  return (
    <div className="item-discount-wrap" aria-label="Special Offers Marquee">
      <div className="marquee-track">
        {MARQUEE_ITEMS.map((text, idx) => (
          <div className="discount-box-wrap" key={idx}>
            <DiscountDiamondIcon className="discount-icon" />
            <span className="discount-text">{text}</span>
          </div>
        ))}
        {/* Duplicate for seamless infinite loop */}
        {MARQUEE_ITEMS.map((text, idx) => (
          <div className="discount-box-wrap" key={`dup-${idx}`}>
            <DiscountDiamondIcon className="discount-icon" />
            <span className="discount-text">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
