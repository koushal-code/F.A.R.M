import React from 'react';

interface FarmLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export const FarmLogo: React.FC<FarmLogoProps> = ({
  className = '',
  size = 40,
  showWordmark = true
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={showWordmark ? "0 0 512 512" : "110 50 290 320"}
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="farmSkyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="farmSunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#facc15" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="farmLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="farmLeafLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id="farmHatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <clipPath id="farmCircleClip">
          <circle cx="256" cy="180" r="140" />
        </clipPath>
      </defs>

      {/* Circular Emblem */}
      <g>
        <circle cx="256" cy="180" r="140" fill="url(#farmSkyGrad)" />
        <g clipPath="url(#farmCircleClip)">
          {/* Rising Sun */}
          <circle cx="320" cy="135" r="42" fill="url(#farmSunGrad)" />

          {/* Distant Trees */}
          <path d="M 310 160 Q 330 148 350 160 Q 365 148 385 160 Q 400 152 415 165 L 420 200 L 300 200 Z" fill="#1e5c2b" />

          {/* Field Rows */}
          <path d="M 270 162 Q 330 170 410 195 L 415 220 Q 330 190 260 175 Z" fill="#15803d" />
          <path d="M 255 174 Q 325 192 415 228 L 415 255 Q 315 212 240 190 Z" fill="#22c55e" />
          <path d="M 235 188 Q 315 214 415 264 L 410 292 Q 305 235 220 206 Z" fill="#4ade80" />
          <path d="M 215 204 Q 300 236 405 300 L 395 325 Q 290 255 198 222 Z" fill="#86efac" />
          <path d="M 195 220 Q 285 258 385 330 L 365 350 Q 275 275 180 238 Z" fill="#16a34a" />
          <path d="M 175 235 Q 270 280 350 355 L 320 370 Q 255 295 160 252 Z" fill="#15803d" />

          {/* Farmer Figure with Straw Hat */}
          <g>
            <path d="M 160 330 C 160 250 185 210 215 205 C 235 205 260 235 285 330 Z" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
            <path d="M 225 218 L 245 320" stroke="#94a3b8" strokeWidth="7" strokeLinecap="round" />
            <path d="M 205 185 L 230 185 L 232 208 L 202 208 Z" fill="#b45309" />
            <path d="M 200 178 C 205 170 230 170 235 185 C 230 195 205 195 200 178 Z" fill="#1c1917" />
            
            <ellipse cx="218" cy="142" rx="34" ry="24" fill="url(#farmHatGrad)" />
            <path d="M 188 152 Q 218 160 248 150 Q 248 144 246 142 Q 218 150 190 144 Z" fill="#78350f" />
            <path d="M 152 165 C 150 135 275 110 285 145 C 290 175 158 190 152 165 Z" fill="url(#farmHatGrad)" />
            <path d="M 175 165 C 190 175 245 168 265 152 C 248 160 200 168 175 165 Z" fill="#a16207" opacity="0.6" />
          </g>
        </g>

        {/* Surrounding Leaf */}
        <path d="M 132 275 C 115 175 185 75 272 72 C 208 95 155 165 168 255 Z" fill="url(#farmLeafLightGrad)" />
        <path d="M 132 225 C 122 325 225 365 292 342 C 322 332 292 288 238 250 C 178 208 142 205 132 225 Z" fill="url(#farmLeafGrad)" />
        <path d="M 152 282 C 182 328 235 345 285 340 C 238 335 192 312 168 274 Z" fill="#ffffff" />
      </g>

      {/* FARM Wordmark */}
      {showWordmark && (
        <g fill="#006837">
          <path d="M 88 385 L 158 385 C 165 385 170 390 170 397 L 170 410 C 170 417 165 422 158 422 L 120 422 L 120 436 L 152 436 C 158 436 163 441 163 447 L 163 459 C 163 465 158 470 152 470 L 120 470 L 120 496 C 120 503 115 508 108 508 L 100 508 C 93 508 88 503 88 496 Z" />
          <g>
            <path d="M 198 508 C 191 508 186 503 188 496 L 218 393 C 220 388 225 385 231 385 L 247 385 C 253 385 258 388 260 393 L 290 496 C 292 503 287 508 280 508 L 268 508 C 262 508 257 504 255 498 L 249 476 L 229 476 L 223 498 C 221 504 216 508 210 508 Z M 239 422 L 232 452 L 246 452 Z" />
            <path d="M 239 426 C 248 435 248 456 237 466 C 230 460 228 440 239 426 Z" fill="#22c55e" />
            <path d="M 239 428 Q 237 448 234 464" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          </g>
          <path d="M 312 385 L 358 385 C 374 385 386 396 386 412 C 386 424 378 433 368 437 C 378 441 384 450 388 468 L 393 495 C 394 502 390 508 383 508 L 371 508 C 365 508 360 503 359 497 L 355 470 C 353 458 348 452 336 452 L 342 452 L 342 496 C 342 503 337 508 330 508 L 324 508 C 317 508 312 503 312 496 Z M 342 411 L 342 430 L 355 430 C 361 430 365 426 365 420 C 365 415 361 411 355 411 Z" />
          <path d="M 408 385 L 424 385 C 430 385 435 388 438 394 L 452 444 L 466 394 C 469 388 474 385 480 385 L 496 385 C 503 385 508 390 508 397 L 508 496 C 508 503 503 508 496 508 L 488 508 C 481 508 476 503 476 496 L 476 430 L 460 488 C 458 494 453 498 447 498 L 441 498 C 435 498 430 494 428 488 L 412 430 L 412 496 C 412 503 407 508 400 508 L 392 508 C 385 508 380 503 380 496 L 380 397 C 380 390 385 385 392 385 Z" />
        </g>
      )}
    </svg>
  );
};
