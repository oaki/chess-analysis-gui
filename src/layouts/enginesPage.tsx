import React, { ChangeEvent, FC, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../store";
import { deleteWorker, loadEngines, setLoading } from "actions";
import { IWorker } from "reducers";
import { Add, MicOff, SignalCellularAlt } from "@emotion-icons/material";
import { MenuWithRouter } from "components/menu/menu";
import { Header } from "components/Header";
import { SessionManagerService } from "services/sessionManager";
import { Flash } from "services/errorManager";
import { IState } from "interfaces";
import {
  StyledBtn,
  StyledBtnText,
  StyledFormWrapper,
  StyledInput,
  StyledLabel,
  StyledPairsWrapper
} from "components/ui/formComponents";
import { ApiManagerService } from "services/apiManager";
import { ListItem } from "components/ui/listItem";
import { StyledContentWrapper, StyledWrapperWithHeader } from "components/ui/styledWrapperWithHeader";
import { List } from "components/ui/list";


export function Rows() {
  const workers = useSelector<IState, IWorker[]>((reduxState) => {
    return reduxState?.workers || [];
  });

  const handleDelete = (id) => {
    store.dispatch(deleteWorker({
      id
    }));
  };

  return (
    <List>
      {workers.map((worker: IWorker) => (
        <ListItem
          key={worker.id}
          id={String(worker.id)}
          handleClick={() => {
          }}
          handleDelete={handleDelete}>

          <div className="f-l">
            {worker.ready && <span className="c-green"><SignalCellularAlt /></span>}
            {!worker.ready && <span><MicOff /></span>}
          </div>
          <div className="p-l-xxl">
            <div className="fs-5">{worker.name}</div>
            <div className="fs-xs">{worker.uuid}</div>
          </div>
        </ListItem>
      ))}
    </List>
  );
}

export const EnginesPage: FC<EnginesPageProps> = memo(({}) => {
  const [state, setState] = useState({ name: "", uuid: "", errorMsg: "" });

  useEffect(() => {
    store.dispatch(loadEngines());
  });
  const handleSubmit = async () => {

    store.dispatch(setLoading(true));

    try {
      const response = await ApiManagerService.addWorker(SessionManagerService.getToken(), state.name, state.uuid);
      if (!response.ok) {
        console.log(response);
        throw new Error("Loading failed");
      }

      const json: any = await response.json();
      console.log(json);
      store.dispatch(loadEngines());
      setState({
        name: "",
        uuid: "",
        errorMsg: ""
      });
    } catch (e) {

      Flash.error({ msg: "Update error", identifier: "worker" });
      store.dispatch(setLoading(false));
      console.log(e);
    }

    store.dispatch(setLoading(false));
  };

  const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prevState) => ({ ...prevState, name: value }));
  };

  const onChangeUuid = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prevState) => ({ ...prevState, uuid: value }));
  };
  return (
    <StyledWrapperWithHeader>
      <Header title="Your chess engines" />

      <StyledContentWrapper>
        <StyledFormWrapper>
          <StyledPairsWrapper>
            <StyledLabel>Name</StyledLabel>
            <StyledInput onChange={onChangeName} type="text" value={state.name} />
          </StyledPairsWrapper>
          <StyledPairsWrapper>
            <StyledLabel>Uuid</StyledLabel>
            <StyledInput onChange={onChangeUuid} type="text" value={state.uuid} />
          </StyledPairsWrapper>

          <StyledBtn onClick={handleSubmit}>
            <Add width={18} />
            <StyledBtnText>Add</StyledBtnText>

          </StyledBtn>

        </StyledFormWrapper>

        <Rows />
      </StyledContentWrapper>

      <MenuWithRouter showMainMenu={true} />
    </StyledWrapperWithHeader>
  );
});

export default EnginesPage;
export type EnginesPageProps = {}



