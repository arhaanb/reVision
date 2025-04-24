import { useState, useEffect } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import ColorPaletteBox from "./ColorPaletteBox";
import { generatePalette } from "../utils/colorUtils";

export default function ColorPickerSection({ onColorChange }) {
  const [color, setColor] = useColor("#561ecb");
  const palette = generatePalette(color.hex);

  useEffect(() => {
    if (onColorChange) onColorChange(color.hex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color.hex]);

  return (
    <div className="w-full flex flex-col items-center mt-10">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Choose a Primary Colour</h2>
      <div className="w-full flex justify-center mb-4">
        <div className="w-full max-w-xl">
          <ColorPicker color={color} onChange={setColor} hideInput={['rgb', 'hsv']} width={"100%"} height={120} />
        </div>
      </div>
      <ColorPaletteBox palette={palette} />
    </div>
  );
}
