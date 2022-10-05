import type { FC } from "react"
import type { User } from "@supabase/auth-helpers-nextjs"
import { Center, Flex, Grid, Icon, Text, VStack } from "@chakra-ui/react"
import type { As } from "@chakra-ui/react"
import { Profile } from "@/common/types"
import { MdAlternateEmail, MdPerson } from "react-icons/md"

const SectionIcon = ({ as }: { as: As<any> }) => {
  return (
    <Center w={[7, null, 8]} h={8}>
      <Icon as={as} w={[6, null, 7]} h={[6, null, 7]} />
    </Center>
  )
}

interface ProfileDetailsProps {
  user: User
  profile: Profile
}

const ProfileDetails: FC<ProfileDetailsProps> = ({ user, profile }) => {
  const { first_name, middle_name, last_name } = profile

  return (
    <Grid templateColumns="auto 1fr" gap={[3, null, 4]}>
      <SectionIcon as={MdPerson} />
      <VStack align="start" spacing={1}>
        <Flex alignItems="center" w="full" minH={8}>
          <Text fontSize="sm">{`${first_name || ``}${
            middle_name ? ` ${middle_name}` : ``
          }${last_name ? ` ${last_name}` : ``}`}</Text>
        </Flex>
      </VStack>

      <SectionIcon as={MdAlternateEmail} />
      <VStack align="start" spacing={1}>
        <Text fontSize="sm">{user.email}</Text>
      </VStack>
    </Grid>
  )
}

export default ProfileDetails
