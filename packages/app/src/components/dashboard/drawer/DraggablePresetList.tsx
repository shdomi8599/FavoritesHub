import PresetItem from "@/components/preset/PresetItem";
import { dragPresetDataState } from "@/states";
import { Preset } from "@/types";
import { Box } from "@mui/material";
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
  DropResult,
} from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";

interface Props {
  dragPresetData: Preset[];
}

export default function DraggablePresetList({ dragPresetData }: Props) {
  const setDragPresetData = useSetRecoilState(dragPresetDataState);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(dragPresetData);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setDragPresetData(items);
  };

  if (dragPresetData?.length)
    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dragPresetDataList">
          {(provided: DroppableProvided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {dragPresetData.map((preset, index) => (
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
                      <PresetItem preset={preset} />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    );
}
