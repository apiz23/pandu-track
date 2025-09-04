"use client";

import { motion } from "motion/react";
import {
    ComponentPropsWithoutRef,
    useEffect,
    useId,
    useRef,
    useState,
    useCallback,
    useMemo,
} from "react";

import { cn } from "@/lib/utils";

export interface AnimatedGridPatternProps
    extends ComponentPropsWithoutRef<"svg"> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeDasharray?: string | number;
    numSquares?: number;
    maxOpacity?: number;
    duration?: number;
    repeatDelay?: number;
    className?: string;
    color?: string;
    randomMove?: boolean;
    randomDuration?: boolean;
}

export function AnimatedGridPattern({
    width = 40,
    height = 40,
    x = -1,
    y = -1,
    strokeDasharray = 0,
    numSquares = 50,
    className,
    maxOpacity = 0.5,
    duration = 4,
    repeatDelay = 0.1,
    color = "currentColor",
    randomMove = true,
    randomDuration = false,
    ...props
}: AnimatedGridPatternProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [squares, setSquares] = useState<
        { id: number; pos: [number, number]; delay: number; duration: number }[]
    >([]);

    // Memoized function to get a random position
    const getPos = useCallback((): [number, number] => {
        return [
            Math.floor((Math.random() * dimensions.width) / width),
            Math.floor((Math.random() * dimensions.height) / height),
        ];
    }, [dimensions.width, dimensions.height, width, height]);

    // Memoized function to generate squares with random properties
    const generateSquares = useCallback(
        (count: number) =>
            Array.from({ length: count }, (_, i) => ({
                id: i,
                pos: getPos(),
                delay: i * repeatDelay,
                duration: randomDuration
                    ? duration * (0.7 + Math.random() * 0.6) // Random duration between 70% and 130% of base
                    : duration,
            })),
        [getPos, repeatDelay, duration, randomDuration]
    );

    // Function to update a square's position
    const updateSquarePosition = useCallback(
        (id: number) => {
            if (!randomMove) return;

            setSquares((currentSquares) =>
                currentSquares.map((sq) =>
                    sq.id === id ? { ...sq, pos: getPos() } : sq
                )
            );
        },
        [getPos, randomMove]
    );

    // Resize observer to handle container size changes
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Generate squares when dimensions change
    useEffect(() => {
        if (dimensions.width && dimensions.height) {
            setSquares(generateSquares(numSquares));
        }
    }, [dimensions, numSquares, generateSquares]);

    // Memoized grid pattern to avoid unnecessary re-renders
    const gridPattern = useMemo(
        () => (
            <pattern
                id={id}
                width={width}
                height={height}
                patternUnits="userSpaceOnUse"
                x={x}
                y={y}
            >
                <path
                    d={`M.5 ${height}V.5H${width}`}
                    fill="none"
                    strokeDasharray={strokeDasharray}
                />
            </pattern>
        ),
        [id, width, height, x, y, strokeDasharray]
    );

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
                className
            )}
            {...props}
        >
            <defs>{gridPattern}</defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
            <svg x={x} y={y} className="overflow-visible">
                {squares.map(
                    ({
                        pos: [xPos, yPos],
                        id,
                        delay,
                        duration: squareDuration,
                    }) => (
                        <motion.rect
                            initial={{ opacity: 0 }}
                            animate={{ opacity: maxOpacity }}
                            transition={{
                                duration: squareDuration,
                                repeat: Infinity,
                                repeatDelay: delay,
                                repeatType: "reverse",
                            }}
                            onAnimationComplete={() => updateSquarePosition(id)}
                            key={`${xPos}-${yPos}-${id}`}
                            width={width - 1}
                            height={height - 1}
                            x={xPos * width + 1}
                            y={yPos * height + 1}
                            fill={color}
                            strokeWidth="0"
                        />
                    )
                )}
            </svg>
        </svg>
    );
}
