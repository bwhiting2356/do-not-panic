
import { JSXElementConstructor, ReactElement, ReactNode } from "react";
import { Dropdown, OverlayTrigger, Tooltip, TooltipProps } from "react-bootstrap";
import { OverlayTriggerRenderProps } from "react-bootstrap/esm/OverlayTrigger";

interface Props {
    tooltipText: string;
    children: ReactElement<any, string | JSXElementConstructor<any>> | ((props: OverlayTriggerRenderProps) => ReactNode);

}
export const DisabledDropdownItemWithTooltip= ({ children, tooltipText }: Props) => {
    const renderTooltip = (props: TooltipProps) => (
        <Tooltip id="button-tooltip" {...props}>
          {tooltipText}
        </Tooltip>
      );

    const doNothingOnClick = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
      }
      
    return (
        <Dropdown.Item eventKey="1" onClick={doNothingOnClick} disabled>
            <OverlayTrigger
                placement="left"
                delay={{ show: 0, hide: 400 }}
                overlay={renderTooltip}
                >
                {children}
            </OverlayTrigger>
        </Dropdown.Item>
    )
}