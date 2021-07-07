import styled from "styled-components";

const LayoutRowBase = styled.div`
  width: min(100vw, 500px);
  height: 52px;
  background-color: var(--background);
  box-sizing: border-box;
  position: relative;
`;

const LayoutRowPrimary = styled(LayoutRowBase)`
  background-color: var(--background-primary);
`;

const LayoutRowPlaceholder = styled(LayoutRowBase)`
  font-size: 50px;
  padding-top: 50px;
  color: var(--background-primary);
  font-weight: bolder;
  text-align: center;
  align-self: flex-start;
`;

export { LayoutRowBase, LayoutRowPrimary, LayoutRowPlaceholder };