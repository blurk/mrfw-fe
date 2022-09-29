import { DefaultMantineColor, Text } from "@mantine/core";
import React from "react";

type Props = {
  accentColor?: "dimmed" | DefaultMantineColor;
  value?: string;
  before?: string;
  after?: string;
};

function ModalTitleWithAccent({
  accentColor = "blue",
  value = "",
  before = "",
  after = "",
}: Props) {
  return (
    <Text>
      {before}{" "}
      <Text component="span" color={accentColor} weight={600}>
        {value}
      </Text>{" "}
      {after}
    </Text>
  );
}

export default ModalTitleWithAccent;
