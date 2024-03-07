import { DropdownMenuShortcut, DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu"
import { CSSProperties, ReactElement, ReactNode, useState } from "react"

export function Dropdown(
  props: {
    className?: string,
    style?: CSSProperties,
    trigger?: ReactNode,
    open?: boolean,
    onOpenChange?: (bool: boolean) => void,
    children?: (dropdown: {
      // close: () => void,
      Label: typeof DropdownMenuLabel,
      Separator: typeof DropdownMenuSeparator,
      Item: typeof DropdownMenuItem,
      CheckboxItem: typeof DropdownMenuCheckboxItem,
      RadioGroup: typeof DropdownMenuRadioGroup,
      RadioItem: typeof DropdownMenuRadioItem,
      Group: typeof DropdownMenuGroup,
      Sub: typeof DropdownMenuSub,
      SubTrigger: typeof DropdownMenuSubTrigger,
      SubContent: typeof DropdownMenuSubContent,
      Shortcut: typeof DropdownMenuShortcut,
      Portal: typeof DropdownMenuPortal,
    }) => ReactElement
  }
) {
  // const [open, setOpen] = useState(false)
  return (
    <DropdownMenu
      open={props.open}
      onOpenChange={props.onOpenChange}
    >
      <DropdownMenuTrigger asChild>
        {props.trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        className={props.className}
        style={props.style}
      >
        {props.children?.({
          Label: DropdownMenuLabel,
          Separator: DropdownMenuSeparator,
          Item: DropdownMenuItem,
          CheckboxItem: DropdownMenuCheckboxItem,
          RadioGroup: DropdownMenuRadioGroup,
          RadioItem: DropdownMenuRadioItem,
          Group: DropdownMenuGroup,
          Sub: DropdownMenuSub,
          SubTrigger: DropdownMenuSubTrigger,
          SubContent: DropdownMenuSubContent,
          Shortcut: DropdownMenuShortcut,
          Portal: DropdownMenuPortal,
          // close: function (): void {
          //   throw new Error("Function not implemented.")
          // }
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}