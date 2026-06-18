import { default as React, FC, memo, ReactNode } from "react";
import type { MouseEvent } from "react";
import { ChevronRight, Delete } from "@emotion-icons/material";
import { SwipeableListItem } from "@sandstreamdev/react-swipeable-list";
import styled from "@emotion/styled";

const SwipeableListItemCompat = SwipeableListItem as React.ComponentType<Record<string, unknown>>;

export const ListItem: FC<ListItemProps> = memo(({ id, handleClick, handleDelete, children }: ListItemProps) => {
  return (
    <SwipeableListItemCompat
      key={id}
      swipeRight={{
        content: <div className={"c-white pl-sm"}><Delete width={16} /> Delete</div>,
        action: () => handleDelete(id)
      }}
    >
      <StyledListItem key={id}
                      onClick={handleClick}
                      data-id={id}>
        <div className="d-b p-sm cur-p">
          <span className="c-white f-r"><ChevronRight width={18} height={18} /></span>
          {children}
        </div>
      </StyledListItem>

    </SwipeableListItemCompat>
  );
});

const StyledListItem = styled.div`
  border-bottom: 1px solid #464646;
`;

type ListItemProps = {
  id: string;
  children: ReactNode;
  handleClick: (e: MouseEvent<HTMLElement>) => void;
  handleDelete: (id: string) => void;
}
