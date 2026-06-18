import React, { FC, memo, useCallback } from "react";
import type { MouseEvent } from "react";
import { useSelector } from "../../libs/stateCompat";
import { Error } from "./error";
import { store } from "../../store";
import { IErrorProps, removeError } from "../../services/errorManager";
import { ReduxStateShape } from "../../reducers";
import styled from "@emotion/styled";

export const ErrorController: FC<ErrorContainerProps> = memo((props: ErrorContainerProps) => {
  const errors = useSelector((state: ReduxStateShape) => {
    return state.errors;
  });

  return <Errors errors={errors} />;
});

export const Errors: FC<ErrorsProps> = memo(({ errors }) => {

  const handleCloseClick = useCallback((e: MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const key = e.currentTarget.dataset.identifier;
    if (!key) {
      return;
    }
    store.dispatch(removeError({ identifier: key }));
  }, []);

  return (

    <StyledPositionWrapper>
      {errors.map((error, index) => (
        <Error key={`error_${index}`} {...error} handleOnClick={handleCloseClick} />))}
    </StyledPositionWrapper>

  );
});

const StyledPositionWrapper = styled.div`
  position: absolute;
  right: 0.6rem;
  bottom: 3.6rem;
`;


type ErrorsProps = {
  errors: IErrorProps[];
}
type ErrorContainerProps = {}
