import { forwardRef } from "react"
import type { ForwardedRef, ReactNode } from "react"
import { Box } from "@chakra-ui/react"
import AnimateHeight from "react-animate-height"

/**
 * Copied from Chakra v0
 * https://github.com/chakra-ui/chakra-ui/blob/v0/packages/chakra-ui/src/Collapse/index.js
 */

interface CollapseProps {
  isOpen: boolean
  animateOpacity?: boolean
  onAnimationStart?: () => void
  onAnimationEnd?: () => void
  duration?: number
  easing?: string
  startingHeight?: "auto" | number | `${number}%`
  endingHeight?: "auto" | number | `${number}%`
  children: ReactNode
}

const Collapse = forwardRef(
  (
    {
      isOpen,
      animateOpacity = true,
      onAnimationStart,
      onAnimationEnd,
      duration,
      easing = "ease",
      startingHeight = 0,
      endingHeight = "auto",
      ...rest
    }: CollapseProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <AnimateHeight
        duration={duration}
        easing={easing}
        animateOpacity={animateOpacity}
        height={isOpen ? endingHeight : startingHeight}
        applyInlineTransitions={false}
        // @ts-ignore
        css={{
          transition:
            "height .2s ease,opacity .2s ease-in-out,transform .2s ease-in-out",
          "&.rah-animating--to-height-zero": {
            opacity: 0,
            transform: "translateY(-0.625rem)",
          },
        }}
        {...{ onAnimationStart, onAnimationEnd }}
      >
        <Box ref={ref} {...rest} />
      </AnimateHeight>
    )
  },
)

Collapse.displayName = "Collapse"

export default Collapse
