import { useState } from "react";
import { CodeTab, PreviewTab, CliTab, TabbedLayout } from "../../components/common/TabbedLayout";
import { Box } from "@chakra-ui/react";

import PreviewSwitch from "../../components/common/PreviewSwitch";
import Customize from "../../components/common/Customize";
import PreviewSlider from "../../components/common/PreviewSlider";
import CodeExample from "../../components/code/CodeExample";
import Dependencies from "../../components/code/Dependencies";
import PropTable from "../../components/common/PropTable";
import CliInstallation from "../../components/code/CliInstallation";

import LiquidButtonJsComponent from "../../content/Components/LiquidButton/LiquidButton";
import { liquidButton } from "../../constants/code/Components/liquidButtonCode";
import LiquidButton from "../../ts-default/Components/LiquidButton/LiquidButton";

const TiltedCardDemo = () => {
  const [rotateAmplitude, setRotateAmplitude] = useState(12);
  const [scaleOnHover, setScaleOnHover] = useState(1.05);
  const [showTooltip, setShowTooltip] = useState(true);
  const [displayOverlayContent, setDisplayOverlayContent] = useState(true);

  const propData = [
    {
      name: "imageSrc",
      type: "string",
      default: "N/A",
      description: "The source URL of the image."
    },
    {
      name: "altText",
      type: "string",
      default: "Tilted card image",
      description: "Alternative text for the image."
    },
    {
      name: "captionText",
      type: "string",
      default: "",
      description: "Text for the tooltip caption."
    },
    {
      name: "containerHeight",
      type: "string",
      default: "600px",
      description: "Height of the overall card container."
    },
    {
      name: "containerWidth",
      type: "string",
      default: "100%",
      description: "Width of the overall card container."
    },
    {
      name: "imageHeight",
      type: "string",
      default: "300px",
      description: "Height of the inner image."
    },
    {
      name: "imageWidth",
      type: "string",
      default: "300px",
      description: "Width of the inner image."
    },
    {
      name: "scaleOnHover",
      type: "number",
      default: "1.1",
      description: "Scaling factor applied on hover."
    },
    {
      name: "rotateAmplitude",
      type: "number",
      default: "14",
      description: "Controls how much the card tilts with mouse movement."
    },
    {
      name: "showMobileWarning",
      type: "boolean",
      default: "true",
      description: "Whether to show a small alert about mobile usage."
    },
    {
      name: "showTooltip",
      type: "boolean",
      default: "true",
      description: "Toggles the visibility of the tooltip (figcaption)."
    },
    {
      name: "displayOverlayContent",
      type: "boolean",
      default: "false",
      description: "Whether to display any overlayContent on top of the image."
    },
    {
      name: "overlayContent",
      type: "ReactNode",
      default: "null",
      description: "A React node to display as an overlay on the card."
    }
  ];

  return (
    <TabbedLayout>
      <PreviewTab>
        <Box position="relative" className="demo-container" minH={500} overflow="hidden">
          <LiquidButton
            primaryColor="#00d9ff"
            backgroundColor="#ff6cb1"
            secondaryColor="#ff9034"
            label="Hover me!"
            className="liquid-button"
            height={50}
            width={200}
            forceFactor={0.1}
            layerOneViscosity={0.5}
            layerTwoViscosity={0.4}
            layerOneMouseForce={400}
            layerTwoMouseForce={500}
            layerOneForceLimit={1}
            layerTwoForceLimit={2}
          />
        </Box>

        <Customize className="preview-options">
          <PreviewSlider
            title="Rotate Amplitude"
            min={0}
            max={30}
            step={1}
            value={rotateAmplitude}
            onChange={setRotateAmplitude}
          />

          <PreviewSlider
            title="Scale on Hover"
            min={1}
            max={1.5}
            step={0.05}
            value={scaleOnHover}
            onChange={setScaleOnHover}
            displayValue={(val) => val.toFixed(2)}
          />

          <PreviewSwitch title="Show Tooltip" isChecked={showTooltip} onChange={(e) => { setShowTooltip(e.target.checked); }} />
          <PreviewSwitch title="Show Overlay Content" isChecked={displayOverlayContent} onChange={(e) => { setDisplayOverlayContent(e.target.checked); }} />
        </Customize>

        <PropTable data={propData} />
      </PreviewTab>

      <CodeTab>
        <CodeExample codeObject={liquidButton} />
      </CodeTab>

      <CliTab>
        <CliInstallation {...liquidButton} />
      </CliTab>
    </TabbedLayout>
  );
};

export default TiltedCardDemo;
