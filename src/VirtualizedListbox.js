import * as React from "react";
import { FixedSizeList } from "react-window";

export const VirtualizedListbox = React.forwardRef(function VirtualizedListbox(
  props,
  ref
) {
  const { children, ...other } = props;

  // smoother scroll height
  const ITEM_HEIGHT = 38;

  // convert children (options) into an array
  const items = React.Children.toArray(children);

  return (
    <div
      ref={ref}
      {...other} 
      style={{ margin: 0, padding: 0 }}
    >
      <FixedSizeList
        height={Math.min(300, items.length * ITEM_HEIGHT)} 
        width="100%"
        itemSize={ITEM_HEIGHT}
        itemCount={items.length}
        overscanCount={8} // smoother scrolling
        itemData={items}
         style={{ overflowY: "hidden" }}
      >
        {({ index, style, data }) => (
          <div style={style}>
    
            {data[index]}
          </div>
        )}
      </FixedSizeList>
    </div>
  );
});
