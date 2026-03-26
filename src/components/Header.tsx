import styled from "styled-components";
import settings from "../settings";

export default function Header() {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        <HeaderHeading>Cards & Transactions</HeaderHeading>
      </HeaderWrapper>
    </HeaderContainer>
  );
}

const HeaderHeading = styled.h1`
  margin: 0;
  padding: 0;
  font-weight: 500;
  text-decoration: none;
  color: ${settings.colors.backgroundSecondary};
`;

const HeaderContainer = styled.header`
  width: 100%;
  background-color: ${settings.colors.foregroundSecondary};
  color: ${settings.colors.backgroundSecondary};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 14px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderWrapper = styled.div`
  max-width: 780px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
