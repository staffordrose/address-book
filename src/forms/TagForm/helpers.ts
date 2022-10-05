import { ContactTag } from "@/common/types"

export const mapPropsToValues = (tag?: ContactTag) => ({
  name: tag?.name || "",
})
