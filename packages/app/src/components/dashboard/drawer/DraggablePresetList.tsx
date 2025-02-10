import PresetItem from "@/components/preset/PresetItem";
import { Preset } from "@/types";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { SetterOrUpdater } from "recoil";

interface Props {
  presets: Preset[];
  viewPreset: Preset;
  setViewPreset: SetterOrUpdater<Preset>;
  editPresetModal: (id: number) => void;
  deletePresetEvent: (id: number) => void;
}

export default function DraggablePresetList({
  presets,
  viewPreset,
  setViewPreset,
  editPresetModal,
  deletePresetEvent,
}: Props) {
  const [presetData, setPresetData] = useState(presets);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(presetData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setPresetData(items);
  };

  useEffect(() => {
    setPresetData(presets.slice(1));
  }, [presets]);

  if (presets.length)
    return (
      <>
        <PresetItem
          preset={presets[0]}
          viewPreset={viewPreset}
          setViewPreset={setViewPreset}
          editPresetModal={editPresetModal}
          deletePresetEvent={deletePresetEvent}
        />
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="presetsList">
            {(provided: DroppableProvided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {presetData.map((preset, index) => (
                  <Draggable
                    index={index}
                    key={preset.id}
                    draggableId={preset.id.toString()}
                  >
                    {(provided: DraggableProvided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <PresetItem
                          preset={preset}
                          viewPreset={viewPreset}
                          setViewPreset={setViewPreset}
                          editPresetModal={editPresetModal}
                          deletePresetEvent={deletePresetEvent}
                        />
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
}
