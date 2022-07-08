import React from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { ColorResult, SketchPicker } from "react-color";

type Props = {
  color?: string;
  onEditColor: (newColor: ColorResult) => void;
};

export function ColorPicker({ color, onEditColor }: Props) {
  return (
    <OverlayTrigger
      rootClose
      trigger="click"
      placement="bottom"
      overlay={
        <Popover id="popover-positioned-bottom" title="Popover right">
          <SketchPicker onChangeComplete={onEditColor} color={color} />
        </Popover>
      }
    >
      <Button
        style={{
          height: "25px",
          backgroundColor: color || "white",
        }}
      ></Button>
    </OverlayTrigger>
  );
}
