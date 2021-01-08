import React, { ChangeEvent, FC, memo, useState } from "react";
import { useSelector } from "react-redux";
import store from "../store";
import { deleteWorker, loadEngines, setLoading } from "actions";
import { IWorker } from "reducers";
import { Add, Delete, MicOff, SignalCellularAlt } from "@emotion-icons/material";
import { MenuWithRouter } from "components/menu/menu";
import { Header } from "components/Header";
import { SessionManagerService } from "services/sessionManager";
import config from "config";
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

const Button = (index, worker) => {
  const handleDelete = () => {
    store.dispatch(deleteWorker({
      id: worker.id
    }));
  };

  return (
    <button className="btn btn-danger f-r" onClick={handleDelete}>
      <Delete />
    </button>
  );
};


export function Rows() {
  const workers = useSelector<IState, IWorker[]>((reduxState) => {
    return reduxState?.workers || [];
  });

  return (
    <ul>
      {workers.map((worker: IWorker, index: number) => (
        <li key={index} className="d-b p-t-md p-b-md list__bottom-line">
          {Button(index, worker)}
          <div className="f-l">
            {worker.ready && <span className="c-green"><SignalCellularAlt /></span>}
            {!worker.ready && <span><MicOff /></span>}
          </div>
          <div className="p-l-xxl">
            <div className="fs-5">{worker.name}</div>
            <div className="fs-xs">{worker.uuid}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const EnginesPage: FC<EnginesPageProps> = memo(({}) => {
  const [state, setState] = useState({ name: "", uuid: "", errorMsg: "" });

  const handleSubmit = async () => {

    const token = SessionManagerService.getToken();
    store.dispatch(setLoading(true));

    const url = `${config.apiHost}/user/workers`;
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("uuid", state.uuid);

    const options: RequestInit = {
      method: "POST",
      headers: new Headers({
        "Authorization": `Bearer ${token}`
      }),
      body: formData
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
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
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <Header title="Your chess engines" />

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
        </div>

        <MenuWithRouter showMainMenu={true} />
      </div>
    </div>
  );
});

export default EnginesPage;
export type EnginesPageProps = {}

