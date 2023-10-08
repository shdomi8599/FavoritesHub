import { viewPresetState } from "@/states";
import { useRecoilValue } from "recoil";

export default function Home() {
  const viewPreset = useRecoilValue(viewPresetState);
  return <div>{viewPreset?.presetName}</div>;
}
