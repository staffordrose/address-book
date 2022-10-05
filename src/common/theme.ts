import { extendTheme } from "@chakra-ui/react"

const theme = extendTheme({
  fonts: {
    heading: '"Roboto Slab", serif',
    body: '"Roboto", serif',
  },
  styles: {
    global: {
      "html, body": {
        color: "black",
        backgroundColor: "#fffff7",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontFamily: "heading",
        _focus: {
          boxShadow: "none",
        },
      },
    },
    Checkbox: {
      baseStyle: {
        control: {
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
    Link: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
    Tag: {
      baseStyle: {
        _focus: {
          boxShadow: "none",
        },
      },
    },
  },
})

export default theme
