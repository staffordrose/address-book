import type { FC, ReactNode } from "react"
import { Button, Center, Icon } from "@chakra-ui/react"
import { MdAdd } from "react-icons/md"

interface FieldArrayAddProps {
  onClick: () => void
  children: ReactNode
}

const FieldArrayAdd: FC<FieldArrayAddProps> = (props) => {
  return (
    <Center w="full" p={4}>
      <Button
        size="sm"
        pl="8px"
        type="button"
        leftIcon={<Icon as={MdAdd} boxSize={5} />}
        {...props}
      />
    </Center>
  )
}

export default FieldArrayAdd
