import React from "react";
import { IErrorProps } from "../../services/errorManager";
import { Close, Info as InfoIcon } from "@emotion-icons/material";
import styled from "@emotion/styled";

export function Error(props: Partial<IErrorProps>) {
  return (
    <StyledWrapper role="alert" key="alert">
      <button onClick={props.handleOnClick} className="c-white f-r" data-identifier={props.identifier}>
        <Close width={16} />
      </button>
      <span className="c-white"><InfoIcon width={16} /></span>
      <span className="m-l-sm">{props.msg}</span>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  background-color: #74b666;
  color: white;
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  font-size: 1rem;
`;