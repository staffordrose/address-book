import type { FC, ReactNode } from "react"
import { Flex } from "@chakra-ui/react"
import type { FlexProps } from "@chakra-ui/react"
import { useDropzone } from "react-dropzone"
import type { FileRejection } from "react-dropzone"

interface DropzoneProps {
  flexDir?: FlexProps["flexDir"]
  gap?: FlexProps["gap"]
  justifyContent?: FlexProps["justifyContent"]
  alignItems?: FlexProps["alignItems"]
  w?: FlexProps["w"]
  minW?: FlexProps["minW"]
  maxW?: FlexProps["maxW"]
  h?: FlexProps["h"]
  minH?: FlexProps["minH"]
  maxH?: FlexProps["maxH"]
  m?: FlexProps["m"]
  mx?: FlexProps["mx"]
  my?: FlexProps["my"]
  p?: FlexProps["p"]
  px?: FlexProps["px"]
  py?: FlexProps["py"]
  borderWidth?: FlexProps["borderWidth"]
  borderStyle?: FlexProps["borderStyle"]
  borderColor?: FlexProps["borderColor"]
  borderRadius?: FlexProps["borderRadius"]
  textAlign?: FlexProps["textAlign"]
  color?: FlexProps["color"]
  bg?: FlexProps["bg"]
  boxShadow?: FlexProps["boxShadow"]
  opacity?: FlexProps["opacity"]
  cursor?: FlexProps["cursor"]
  _hover?: FlexProps["_hover"]
  _focus?: FlexProps["_focus"]
  _active?: FlexProps["_active"]
  accept?: { [key: string]: string[] }
  onDrop: (acceptedFiles: File[]) => void
  onDropRejected: (fileRejection: FileRejection[]) => void
  disabled?: boolean
  activeState?: ReactNode
  children?: ReactNode
}

const Dropzone: FC<DropzoneProps> = ({
  flexDir = "column",
  gap = 4,
  justifyContent = "center",
  alignItems = "center",
  minH = 64,
  borderWidth = 1,
  borderStyle = "dashed",
  borderColor = "teal.200",
  borderRadius = "xl",
  textAlign = "center",
  cursor = "pointer",
  _hover = { bg: "teal.50" },
  _focus = { bg: "teal.100" },
  _active = { bg: "teal.100" },
  accept,
  onDrop,
  onDropRejected = () => null,
  disabled,
  activeState = `Drop the file(s) here`,
  children = `Drag and drop file(s) here, or click to open file explorer`,
  ...props
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    disabled,
    onDrop,
    onDropRejected,
  })

  return (
    <Flex
      flexDir={flexDir}
      gap={gap}
      justifyContent={justifyContent}
      alignItems={alignItems}
      minH={minH}
      borderWidth={borderWidth}
      borderStyle={borderStyle}
      borderColor={borderColor}
      borderRadius={borderRadius}
      textAlign={textAlign}
      cursor={!disabled ? cursor : "not-allowed"}
      _hover={!disabled ? _hover : undefined}
      _focus={!disabled ? _focus : undefined}
      _active={!disabled ? _active : undefined}
      {...props}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      {isDragActive ? activeState : children}
    </Flex>
  )
}

export default Dropzone
