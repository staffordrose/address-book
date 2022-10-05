import type { ReactNode } from "react"
import { ButtonGroup, Flex, Icon, IconButton } from "@chakra-ui/react"
import { MdArrowUpward, MdArrowDownward, MdClose } from "react-icons/md"

const FieldArrayItem = (props: { children: ReactNode }) => {
  return (
    <Flex
      className="field-array-item" // Used for hover selector in nested components
      gap={4}
      justifyContent="space-between"
      alignItems="center"
      w="full"
      maxW={1280}
      p={4}
      _hover={{ bg: "yellow.50" }}
      _focusWithin={{ bg: "yellow.50" }}
      {...props}
    />
  )
}

const FieldArrayItemLeftColumn = (props: {
  visibility: "visible" | "hidden"
  children: ReactNode
}) => {
  return (
    <Flex
      gap={4}
      justifyContent="flex-start"
      alignItems="center"
      w="full"
      maxW={[115, null, 270]}
      {...props}
    />
  )
}

const FieldArrayItemSwap = ({
  index,
  length,
  swap,
}: {
  index: number
  length: number
  swap: (a: number, b: number) => void
}) => {
  return (
    <ButtonGroup
      variant="ghost"
      size="sm"
      sx={{
        opacity: 0,
        ".field-array-item:hover &": {
          opacity: 1,
        },
        ".field-array-item:focus-within &": {
          opacity: 1,
        },
      }}
      isAttached
    >
      <IconButton
        mr="-px"
        type="button"
        aria-label="Move up"
        icon={<Icon as={MdArrowUpward} boxSize={5} />}
        disabled={index === 0}
        onClick={() => swap(index, index - 1)}
      />
      <IconButton
        type="button"
        aria-label="Move down"
        icon={<Icon as={MdArrowDownward} boxSize={5} />}
        disabled={index === length - 1}
        onClick={() => swap(index, index + 1)}
      />
    </ButtonGroup>
  )
}

const FieldArrayItemRightColumn = (props: { children: ReactNode }) => {
  return (
    <Flex
      gap={4}
      justifyContent="space-between"
      alignItems="center"
      w="full"
      maxW={960}
      {...props}
    />
  )
}

const FieldArrayItemRemove = (props: {
  ["aria-label"]: string
  onClick: () => void
}) => {
  return (
    <IconButton
      variant="ghost"
      size="sm"
      sx={{
        opacity: 0,
        ".field-array-item:hover &": {
          opacity: 1,
        },
        ".field-array-item:focus-within &": {
          opacity: 1,
        },
      }}
      type="button"
      icon={<Icon as={MdClose} boxSize={5} />}
      {...props}
    />
  )
}

FieldArrayItem.LeftColumn = FieldArrayItemLeftColumn
FieldArrayItem.Swap = FieldArrayItemSwap
FieldArrayItem.RightColumn = FieldArrayItemRightColumn
FieldArrayItem.Remove = FieldArrayItemRemove

export default FieldArrayItem
