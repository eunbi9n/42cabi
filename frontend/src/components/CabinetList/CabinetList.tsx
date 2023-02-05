import { CabinetInfo } from "@/types/dto/cabinet.dto";
import styled from "styled-components";
import CabinetListItem from "@/components/CabinetList/CabinetListItem/CabinetListItem";
import AdminCabinetListItem from "@/components/CabinetList/CabinetListItem/AdminCabinetListItem";

interface CabinetListInterface {
  colNum: number;
  cabinetInfo: CabinetInfo[];
  isAdmin: boolean;
  isMultiSelect: boolean;
}

const DEFAULT_COL_NUM = 4;

const CabinetList = ({
  colNum,
  cabinetInfo,
  isAdmin,
  isMultiSelect,
}: CabinetListInterface): JSX.Element => {
  if (isAdmin) {
    return (
      <CabinetListContainerStyled colNum={colNum ?? DEFAULT_COL_NUM}>
        {cabinetInfo.map((cabinet, index) => (
          <AdminCabinetListItem
            cabinet={cabinet}
            isMultiSelect={isMultiSelect}
            key={index}
          />
        ))}
      </CabinetListContainerStyled>
    );
  } else {
    return (
      <CabinetListContainerStyled colNum={colNum ?? DEFAULT_COL_NUM}>
        {cabinetInfo.map((cabinet, index) => (
          <CabinetListItem {...cabinet} key={index} />
        ))}
      </CabinetListContainerStyled>
    );
  }
};

const CabinetListContainerStyled = styled.div<{
  colNum: number;
}>`
  display: grid;
  grid-template-columns: repeat(auto-fill, 90px);
  grid-auto-flow: row;
  justify-content: center;
  min-width: 180px;
  width: 100%;
  max-width: ${(props) => props.colNum * 90}px;
`;

export default CabinetList;
